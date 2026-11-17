/** Atryx enquiry handler — deploy in Google Apps Script, not on the web host.
 * Script Property required: RECIPIENT_EMAIL (your receiving business email).
 * Execute as: Me. Access: Anyone. Deploy as a web app, then set config.js URL.
 * Uses Google ContentService JSON; browser requires a readable CORS response.
 * See README for live validation and fallback instructions.
 */
function doGet() {
  return json_({ok: true, service: 'Atryx enquiry service', version: 1});
}
function doPost(e) {
  var lock = LockService.getScriptLock();
  var locked = false;
  try {
    if (!e || !e.postData || e.postData.contents.length > 15000) return json_({ok:false});
    var d = JSON.parse(e.postData.contents);
    if (d.companyWebsite || d.consent !== true) return json_({ok:false});
    var limits = {business:120,contactName:100,email:150,phone:22,profile:300,city:120,plan:30,goal:2000,budget:100,requestId:100};
    Object.keys(limits).forEach(function(k) {
      if (typeof d[k] !== 'string' || d[k].length > limits[k]) throw new Error('Invalid field');
      d[k] = d[k].trim();
    });
    if (!d.business || !d.contactName || !d.city || !d.goal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) || /[\r\n]/.test(d.email)) return json_({ok:false});
    if (!/^[+\d\s()-]+$/.test(d.phone) || d.phone.replace(/\D/g,'').length < 10 || d.phone.replace(/\D/g,'').length > 15) return json_({ok:false});
    if (['unsure','starter','growth','capture'].indexOf(d.plan) < 0 || !/^[a-zA-Z0-9-]{8,100}$/.test(d.requestId)) return json_({ok:false});
    var recipient = PropertiesService.getScriptProperties().getProperty('RECIPIENT_EMAIL');
    if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) return json_({ok:false});
    locked = lock.tryLock(10000);
    if (!locked) return json_({ok:false});
    var cache = CacheService.getScriptCache();
    var hash = Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(d)));
    var key = 'sent-' + hash;
    if (cache.get(key)) return json_({ok:true});
    var emailHash = Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,d.email.toLowerCase()));
    var rateKey = 'rate-' + emailHash;
    var count = Number(cache.get(rateKey) || 0);
    var props = PropertiesService.getScriptProperties();
    var day = Utilities.formatDate(new Date(),'Asia/Kolkata','yyyy-MM-dd');
    var total = props.getProperty('COUNT_DAY') === day ? Number(props.getProperty('COUNT_TOTAL') || 0) : 0;
    // Lightweight quota protection; consider stronger anti-abuse controls if needed.
    if (count >= 3 || total >= 50 || MailApp.getRemainingDailyQuota() < 1) return json_({ok:false});
    var body = 'New Atryx website enquiry\n\n' +
      'Business: ' + d.business + '\nContact: ' + d.contactName + '\nEmail: ' + d.email + '\nPhone: ' + d.phone +
      '\nProfile / website: ' + d.profile + '\nLocation: ' + d.city + '\nPlan: ' + d.plan + '\nBudget: ' + d.budget +
      '\n\nGoal:\n' + d.goal + '\n\nContact consent: yes\nRequest ID: ' + d.requestId + '\nReceived: ' + new Date().toISOString();
    MailApp.sendEmail({to:recipient,replyTo:d.email,subject:'Atryx enquiry: ' + d.business.replace(/[\r\n]/g,' '),body:body,name:'Atryx Website'});
    cache.put(key,'1',21600);
    cache.put(rateKey,String(count+1),3600);
    props.setProperties({COUNT_DAY:day,COUNT_TOTAL:String(total+1)});
    return json_({ok:true});
  } catch (_) {
    return json_({ok:false});
  } finally {
    if (locked) lock.releaseLock();
  }
}
function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

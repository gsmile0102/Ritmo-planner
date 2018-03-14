module.exports = function(ctx) {
  var fs = ctx.requireCordovaModule('fs'),
    path = ctx.requireCordovaModule('path'),
    xml = ctx.requireCordovaModule('cordova-common').xmlHelpers;
  var gradlePath = path.join(ctx.opts.projectRoot, 'platforms/android/build.gradle');
  var gradleAppendedText = '\nconfigurations.all {\nresolutionStrategy.force \'com.android.support:support-v4:26.0.0\'\n}';

  fs.readFile(gradlePath, function read(err, data) {
    if (err) {
      throw err;
    }
    if(data.indexOf('com.android.support:support-v4:26.0.0') === -1){
      fs.appendFile(gradlePath, gradleAppendedText, function (err) {
        if (err) throw err;
      });
    }
  });
};

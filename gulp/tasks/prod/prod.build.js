import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('prod.build', 'Build client and server app for production', cb => runSequence(
  'prod.server.build',
  'prod.client.build',
  cb
));

gulp.task('prod.client.build', 'Build client app for production', cb => runSequence(
  'install.client.dev',
  //'prod.client.bundle',
  'prod.client.bundle',
  //'prod.client.less',
  //'prod.client.index',
  cb
));

gulp.task('prod.server.build', 'Build server app for production', cb => runSequence(
  'server.copy',
  'install.server.dist',
  'prod.server.transpile',
  cb
));



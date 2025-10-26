import { resolve, join } from 'path';
import { uploadCourse } from './course/init.js'
import * as util from './util.js'
import * as global from './global.js'
import * as about from './unique/about.js'
import * as courses from './unique/courses.js'
import * as home from './unique/home.js'
import * as page404 from './unique/404.js'
import * as tools from './tools/home.js'


// proccess global data
global.init();


// generate and write unique pages
about.upload()
courses.upload()
home.upload()
tools.upload()
page404.upload()


// write each page
global.courses.forEach(course => uploadCourse(course));


// copy icons from src/icons to public/icons
const iconsDir = resolve("src/icons")
util.getAllFiles(iconsDir).forEach(icon => {
  const srcPath = join(iconsDir, icon)
  const destPath = join("icons", icon);
  util.copyFile(srcPath, destPath);
})


// copy stylesheets from src/css to public/css
const stylesheetsDir = resolve("src/css")
util.getAllFiles(stylesheetsDir).forEach(css => {
  const srcPath = join(stylesheetsDir, css)
  const destPath = join("css", css);
  util.copyFile(srcPath, destPath)
})


// copy scripts from src/css to public/css
const scriptsDir = resolve("src/js")
util.getAllFiles(scriptsDir).forEach(js => {
  const srcPath = join(scriptsDir, js)
  const destPath = join("js", js);
  util.copyFile(srcPath, destPath)
})


// copy slides from src/slides to public/slides
const slidesDir = resolve("src/slides")
util.getAllFiles(slidesDir).forEach(slide => {
  const srcPath = join(slidesDir, slide)
  const destPath = join("slides", slide);
  util.copyFile(srcPath, destPath)
})


// copy images from src/images to public/images
const imagesDir = resolve("src/images")
util.getAllFiles(imagesDir).forEach(image => {
  const srcPath = join(imagesDir, image)
  const destPath = join("images", image);
  util.copyFile(srcPath, destPath)
})


// copy resources from src/resources to public/resources
const resourcesDir = resolve("src/resources")
util.getAllFiles(resourcesDir).forEach(resource => {
  const srcPath = join(resourcesDir, resource)
  const destPath = join("resources", resource);
  util.copyFile(srcPath, destPath)
})


// indexing page for old url
util.copyFile(resolve("google40156cb497ef1d05.html"), "google40156cb497ef1d05.html")
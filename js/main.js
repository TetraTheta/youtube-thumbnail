/* So... You are inspecting my scripts... That's ok. */
var video_id = '';
var thumb = new Array(9);

document.getElementById('YTinput').addEventListener('keyup', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById('YTsubmit').click();
  }
})

function TB_clear() {
  document.getElementById('YTinput').value = '';
  result_clear();
}
function TB_example() {
  document.getElementById('YTinput').value = 'https://youtu.be/dQw4w9WgXcQ';
}
function TB_input() {
  if (document.getElementById('YTinput').value === '') {
    alert('Please input valid YouTube video link!');
    return false;
  }
  var input = document.getElementById('YTinput').value; // Get string from input tag
  input = input.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (input[2] !== undefined) {
    video_id = input[2].split(/[^0-9a-z_\-]/i);
    video_id = video_id[0];
  } else {
    video_id = input;
  }
  get_thumb_info();
  get_image();
}
function result_clear() {
  var result_main = document.getElementById('result_main');
  result_main.parentNode.removeChild(result_main);
  var result_top = document.getElementById('result_top');
  result_top.innerHTML = '<h3>Result</h3><div id="result_main"></div>'
}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ('withCredentials' in xhr) {
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != 'undefined') {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
}
function check_image(url) {
  var xhr = createCORSRequest('HEAD', url);
  if (!xhr) {
    throw new Error('CORS is not supported!');
  }
  return xhr.status != 404;
}
function get_thumb_info() {
  thumb[0] = check_image('https://i1.ytimg.com/vi/' + video_id + '/0.jpg'); // Player Background (480x360)
  thumb[1] = check_image('https://i1.ytimg.com/vi/' + video_id + '/1.jpg'); // Start (120x90)
  thumb[2] = check_image('https://i1.ytimg.com/vi/' + video_id + '/2.jpg'); // Middle (120x90)
  thumb[3] = check_image('https://i1.ytimg.com/vi/' + video_id + '/3.jpg'); // End (120x90)
  thumb[4] = check_image('https://i1.ytimg.com/vi/' + video_id + '/default.jpg'); // Normal Quality (120x90)
  thumb[5] = check_image('https://i1.ytimg.com/vi/' + video_id + '/mqdefault.jpg'); // Medium Quality (320x180)
  thumb[6] = check_image('https://i1.ytimg.com/vi/' + video_id + '/hqdefault.jpg'); // High Quality (480x360)
  thumb[7] = check_image('https://i1.ytimg.com/vi/' + video_id + '/sddefault.jpg'); // Standard Quality (Optional) (640x480)
  thumb[8] = check_image('https://i1.ytimg.com/vi/' + video_id + '/maxresdefault.jpg'); // Maximum Quality (Optional) (1280x720 or 1920x1080)
  /*
  thumb.forEach(function(element, index, array) {
    console.log(`${array}의 ${index}번째 요소: ${element}`);
  })
  */
}

function get_image() {
  if (thumb.includes(true)) {
    var inner = '';
    if (thumb[0]) { // Player Background
      inner += '<h4>Player Background</h4>' + '<img class="res_img" src="https://i1.ytimg.com/vi/' + video_id + '/0.jpg" download><br>';
    }
    if (thumb[1] || thumb[2] || thumb[3]) { // Start +  Middle + End
      inner += '<div class="result_sme">';
      inner += '<img class="res_img" src="https://i1.ytimg.com/vi/' + video_id + '/1.jpg" download> ';
      inner += '<img class="res_img" src="https://i1.ytimg.com/vi/' + video_id + '/2.jpg" download> ';
      inner += '<img class="res_img" src="https://i1.ytimg.com/vi/' + video_id + '/3.jpg" download> ';
      inner += '</div>';
    }
    if (thumb[4]) { // Normal Quality (120x90)
      inner += '<h4>Normal Quality (120x90)</h4>'
      inner += '<img class="res_img" src="https://i1.ytimg.com/vi/' + video_id + '/default.jpg" download><br>';
    }
    if (thumb[5]) { // Medium Quality (320x180)
      inner += '<h4>Medium Quality (320x180)</h4>'
      inner += '<img class="res_img" src="https://i1.ytimg.com/vi/' + video_id + '/mqdefault.jpg" download><br>';
    }
    if (thumb[6]) { // High Quality (480x360)
      inner += '<h4>High Quality (480x360)</h4>'
      inner += '<img class="res_img" src="https://i1.ytimg.com/vi/' + video_id + '/hqdefault.jpg" download><br>';
    }
    if (thumb[7]) { // Standard Quality (Optional) (640x480)
      inner += '<h4>Standard Quality (Optional) (640x480)</h4>'
      inner += '<img class="res_img" src="https://i1.ytimg.com/vi/' + video_id + '/sddefault.jpg" download><br>';
    }
    if (thumb[7]) { // Maximum Quality (Optional) (1280x720 or 1920x1080)
      inner += '<h4>Maximum Quality (Optional) (1280x720 or 1920x1080)</h4>'
      inner += '<img class="res_img" src="https://i1.ytimg.com/vi/' + video_id + '/maxresdefault.jpg" download><br>';
    }
    document.getElementById('result_main').innerHTML = inner;
  }
}


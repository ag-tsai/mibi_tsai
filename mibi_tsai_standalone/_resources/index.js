/* ##########################################
   ##########  MIBI TSAI SETTINGS  ##########
   ########################################## */

var tsai=new MIBI_TSAI();

/* #####################################
   ##########  MIBI SETTINGS  ##########
   ##################################### */
tsai.url_standalone(true);
tsai.url_run_log(     '');
tsai.url_mibi_tracker('');
// tsai.url_mibi_hv(           'http://ionpath/hv-ui/');
// tsai.url_mibi_control(      'http://ionpath/#/');
// tsai.url_mibi_configuration('http://ionpath/config-ui/');
// tsai.url_mibi_service(      'http://ionpath/service-ui/');
// tsai.url_mibi_settings(     'http://ionpath/settings-ui/');
tsai.fov_add(200); // list of allowable fov sizes
tsai.fov_add(400);
tsai.fov_add(800);
tsai.raster_add(32); // list of allowable raster sizes
tsai.raster_add(64);
tsai.raster_add(128);
tsai.raster_add(256);
tsai.raster_add(512);
tsai.raster_add(1024);
tsai.raster_add(2048);
tsai.dwell_add('0.25 ms', 11); // list of allowable dwell times and timing choices
tsai.dwell_add('0.5 ms' , 10);
tsai.dwell_add('1 ms'   ,  7);
tsai.dwell_add('2 ms'   ,  8);
tsai.dwell_add('4 ms'   ,  9);
tsai.preset_add('Coarse (0.65 \u00b5m)'    , {"scanCount":1, "centerPointMicrons":{"x":0, "y":0}, "fovSizeMicrons":800, "timingChoice":10, "frameSizePixels":{"width":2048, "height":2048}, "imagingPreset": {"preset":"High Speed", "aperture":"2", "displayName":"Coarse"     , "defaults":{"timingChoice":10}, "currentMeterMode":5}, "sectionId":0, "slideId":0, "name":"Coarse", "notes":null, "timingDescription":"0.5 ms" });
tsai.preset_add('Fine (0.5 \u00b5m)'       , {"scanCount":1, "centerPointMicrons":{"x":0, "y":0}, "fovSizeMicrons":800, "timingChoice": 7, "frameSizePixels":{"width":2048, "height":2048}, "imagingPreset": {"preset":"Normal"    , "aperture":"2", "displayName":"Fine"       , "defaults":{"timingChoice": 7}, "currentMeterMode":5}, "sectionId":0, "slideId":0, "name":"Fine"  , "notes":null, "timingDescription":"1 ms"});
tsai.preset_add('Super Fine (0.39 \u00b5m)', {"scanCount":1, "centerPointMicrons":{"x":0, "y":0}, "fovSizeMicrons":800, "timingChoice": 7, "frameSizePixels":{"width":2048, "height":2048}, "imagingPreset": {"preset":"High Res"  , "aperture":"2", "displayName":"Super Fine" , "defaults":{"timingChoice": 8}, "currentMeterMode":5}, "sectionId":0, "slideId":0, "name":"Fine"  , "notes":null, "timingDescription":"2 ms"});
tsai.preset_add('Molybdenum'               , {"scanCount":1, "centerPointMicrons":{"x":0, "y":0}, "fovSizeMicrons":200, "timingChoice": 7, "frameSizePixels":{"width": 128, "height": 128}, "imagingPreset": {"preset":"Tuning"    , "aperture":"3", "displayName":"QC - 100Âµm", "defaults":{"timingChoice": 7}, "currentMeterMode":7}, "sectionId":0, "slideId":0, "name":"MoQC"  , "notes":null, "timingDescription":"1 ms", "standardTarget":"Molybdenum Foil"});
tsai.preset_recommended('Moly'       , ['1 ms']); // list of recommended preset/dwell time combinations
tsai.preset_recommended('Coarse'     , ['0.25 ms', '0.5 ms']);
tsai.preset_recommended('Fine'       , ['1 ms']);
tsai.preset_recommended('Super Fine' , ['2 ms', '4 ms']);
tsai.preset_recommended('0.25 ms'    , ['Coarse']);
tsai.preset_recommended('0.5 ms'     , ['Coarse']);
tsai.preset_recommended('1 ms'       , ['Fine']);
tsai.preset_recommended('2 ms'       , ['Super Fine']);
tsai.preset_recommended('4 ms'       , ['Super Fine']);

/* #####################################
   ##########  TSAI SETTINGS  ##########
   #####################################
   Commented lines below are default values, uncomment and modify to change
*/
tsai.coregistration_cookie('mibi_tsai');
tsai.coregistration_default('0,0,-27.408,75.483|1131,0,51.487,76.103|0,1131,-26.609,-2.815|1131,1131,52.286,-2.196');
// tsai.optical_crop(250);             // number of pixels to crop from left and right of image
// tsai.optical_bounds({left: 380, right: 748, top: 0, bottom: 1132}); // rough slide boundaries in optical pixels, only used for warning user if possibly imaging outside these boundaries
// tsai.action_nudge_opt(20);          // default nudge distance in microns
// tsai.action_nudge(100);             // default nudge distance in microns
// tsai.action_nudge_shift(200);       // default nudge distance in microns
// tsai.cursor_size(27);               // default cursor size
// tsai.cursor_opacity(0.8);           // default cursor opacity
// tsai.slide_labels(false);           // draw tile labels onto slide image
// tsai.slide_labels_font('Source Sans Pro'); // default font for slide image tile labels
// tsai.slide_labels_size(18);         // default size for slide image tile labels
// tsai.line_thickness(2);             // default line thickness
// tsai.line_circle(5);                // default detection radius for closing polygon and expanding tma
// tsai.line_color_default('#ffffff'); // default line color
// tsai.hover_line_opacity(0.18);      // hovered tile line opacity
// tsai.hover_fill_opacity(0.36);      // hovered tile line opacity
// tsai.tma_crosshair(3.5);            // tma positioning crosshair arm length
// tsai.tma_line_opacity(0.7);         // tma line opacity

/* #################################################
   ##########  COORDINATES BOXES OPTIONS  ##########
   ################################################# */
// tsai.coordinates_crosshair(10);     // coordinates crosshair arm length
// tsai.coordinates_line_thickness(3); // coordinates line thickness
// tsai.coordinates_line_opacity(0.8); // coordinates line transparency
   tsai.coordinates_color_add('#e50808', '#eeeeee'); // digital red
   tsai.coordinates_color_add('#1aecba', '#000000'); // digital green
   tsai.coordinates_color_add('#37afff', '#eeeeee'); // replacement blue
   tsai.coordinates_color_add('#f9a44a', '#000000'); // poppy orange

/* ###################################
   ##########  LINE COLORS  ##########
   ################################### */
   tsai.line_color_add('#e50808', '#eeeeee');  // digital red
   tsai.line_color_add('#6fc3ff', '#000000');  // digital blue
// tsai.line_color_add('#59b3a9', '#eeeeee');  // palo verde green
   tsai.line_color_add('#59c3b9', '#000000');  // replacement green
// tsai.line_color_add('#fedd5c', '#333333');  // illuminating yellow
   tsai.line_color_add('#fcca03', '#000000');  // replacement yellow
   tsai.line_color_add('#bd9a7a', '#000000');  // replacement brown
   tsai.line_color_add('#8383ff', '#ffffff');  // replacement lavender
// tsai.line_color_add('#f4f4f4', '#333333');  // fog grey
   tsai.line_color_add('#e2c9d7', '#333333');  // replacement grey
   tsai.line_color_add('#ff39a4', '#ffffff');  // replacement pink
// tsai.line_color_add('#009ab4', '#eeeeee');  // lagunita blue
   tsai.line_color_add('#006dff', '#ffffff');  // replacement blue
   tsai.line_color_add('#98ebc8', '#000000');  // replacement green
// tsai.line_color_add('#a6b168', '#eeeeee');  // olive green
   tsai.line_color_add('#37afff', '#eeeeee');  // replacement blue
   tsai.line_color_add('#f4795b', '#eeeeee');  // spirited orange
// tsai.line_color_add('#d4d1d1', '#000000');  // stone grey
   tsai.line_color_add('#949191', '#000000');  // replacement grey
// tsai.line_color_add('#c61391', '#eeeeee');  // red-purple
// tsai.line_color_add('#734675', '#eeeeee');  // plum purple
   tsai.line_color_add('#b346f5', '#ffffff');  // replacement purple
   tsai.line_color_add('#ff6202', '#ffffff');  // replacement red
   tsai.line_color_add('#0000ff', '#ffffff');  // replacement blue
   tsai.line_color_add('#b5651d', '#000000');  // replacement brown
// tsai.line_color_add('#67afd2', '#eeeeee');  // sky blue
   tsai.line_color_add('#00fb50', '#000000');  // replacement green
   tsai.line_color_add('#dd20fe', '#eeeeee');  // replacement purple
   tsai.line_color_add('#e9bbba', '#000000');  // replacement pink
   tsai.line_color_add('#2d716f', '#eeeeee');  // palo alto green
   tsai.line_color_add('#2153ff', '#ffffff');  // replacement blue
   tsai.line_color_add('#f9a44a', '#000000');  // poppy orange
   tsai.line_color_add('#b83a4b', '#eeeeee');  // cardinal red
// tsai.line_color_add('#8fe4d7', '#000000');  // 
   tsai.line_color_add('#1aecba', '#000000');  // digital green
   tsai.line_color_add('#a3d6ef', '#000000');  // 
   tsai.line_color_add('#ffcba9', '#000000');  // 
// tsai.line_color_add('#ffbbb3', '#000000');  // 
// tsai.line_color_add('#7f2d48', '#eeeeee');  // brick red
   tsai.line_color_add('#7c8a72', '#ffffff');  // replacement grey
   tsai.line_color_add('#ffd39a', '#000000');  // light orange
   tsai.line_color_add('#8ab8a7', '#eeeeee');  // bay green

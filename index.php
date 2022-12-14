
<!DOCTYPE html>
<!--[if lt IE 7 ]><html class="ie ie6" lang="en"> <![endif]-->
<!--[if IE 7 ]><html class="ie ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]><html class="ie ie8" lang="en"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--><html lang="en"> <!--<![endif]-->
<head>

	<!-- Basic Page Needs
    ================================================== -->
	<meta charset="utf-8">
	<title>Vísar - Base Styles</title>
	<meta name="description" content="">
	<meta name="author" content="Brennan Novak">

	<!-- Mobile Specific Metas
    ================================================== -->
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

	<!-- CSS
    ================================================== -->
	<link rel="stylesheet" href="css/template.css">
	<link rel="stylesheet" href="css/guide.css">

	<!--[if lt IE 9]>
		<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->

	<!-- Favicons
	================================================== -->
	<link rel="shortcut icon" href="img/favicon.ico">
	<link rel="apple-touch-icon" href="img/apple-touch-icon.png">
	<link rel="apple-touch-icon" sizes="72x72" href="img/apple-touch-icon-72x72.png">
	<link rel="apple-touch-icon" sizes="114x114" href="img/apple-touch-icon-114x114.png">

</head>
<body>

	<div id="messages">
		<div class="error clearfix">
			<span class="message-text">Hey there Cowboy, seems like you've mozyed on over to an error that you ain't supposed to have!</span>
			<abbr title="Close" class="message-close">X</abbr>
		</div>
		<div class="warning clearfix">
			<span class="message-text">This here be a warnin to yuh, just a warnin mind you!</span>
			<abbr title="Close" class="message-close">X</abbr>
		</div>
		<div class="debug clearfix">
			<span class="message-text">What kind of bug is a debug?</span>
			<abbr title="Close" class="message-close">X</abbr>
		</div>
		<div class="info clearfix">
			<span class="message-text">Hi, hi, hi, I am info</span>
			<abbr title="Close" class="message-close">X</abbr>
		</div>
		<div class="success clearfix">
			<span class="message-text">Success!</span>
			<abbr title="Close" class="message-close">X</abbr>
		</div>
	</div>		


	<div class="container add-top">

		<div class="sixteen columns content">
			<h1>Vísar Style Guide</h1>
			
			<h5>HTML &amp; CSS for Vísar.is</h5>
		</div>

		<!-- Three Collumns	
		================================================== -->

		<div class="clearfix">
			<div class="half column">
				<h3>This Style Guide</h3>
				<p>This is a collection of CSS styles and corresponding HTML elements that are currently being styled. Use this code to develop the front-end of your website. A large part of this code was hacked from the <a href="http://www.getskeleton.com">Skeleton Framework</a>. The CSS styles are all broken apart into smaller more easy to manage <a href="http://lesscss.org/" target="_blank">LESS</a> files which need to compiled to see the changes affect the main template.css file. If you're unfamiliar with LESS I suggest <a href="http://incident57.com/codekit/" target="_blank">CodeKit</a> for Mac OS, or <a href="http://gruntjs.com/" target="_blank">Grunt</a> (which uses Node.js) for other platforms</p>
	
			</div>		
			<div class="half column">
				<h3>About Skeleton?</h3>
				<p>Skeleton is a small collection of well-organized CSS files that can help you rapidly develop sites that look beautiful at any size, be it a 17" laptop screen or an iPhone. It's based on a responsive grid, but also provides very basic CSS for typography, buttons, forms and media queries. Go ahead, resize this super basic page to see the grid in action.</p>
	
			</div>
		</div>

		<div class="clearfix">
			<div class="one-third column">
				<h3>3 Core Principles</h3>
				<p>Skeleton is built on three core principles:</p>
				<ul class="square">
					<li><strong>A Responsive Grid Down To Mobile</strong>: Elegant scaling from a browser to tablets to mobile.</li>
					<li><strong>Fast to Start</strong>: It's a tool for rapid development with best practices</li>
					<li><strong>Style Agnostic</strong>: It provides the most basic, beautiful styles, but is meant to be overwritten.</li>
				</ul>
			</div>
			<div class="one-third column">
				<h3>Docs &amp; Support</h3>
				<p>The easiest way to really get started with Skeleton is to check out the full docs and info at <a href="http://www.getskeleton.com">www.getskeleton.com.</a>. Skeleton is also open-source and has a <a href="https://github.com/dhgamache/skeleton">project on git</a>, so check that out if you want to report bugs or create a pull request. If you have any questions, thoughts, concerns or feedback, please don't hesitate to email me at <a href="mailto:hi@getskeleton.com">hi@getskeleton.com</a>.</p>
			</div>
			<div class="one-third column">
				<h3>Are You Hip?</h3>
				<p>Lomo locavore swag retro stumptown four loko keytar polaroid. Portland selfies cray, plaid pop-up salvia sustainable literally. Marfa church-key 3 wolf moon narwhal aesthetic. Hoodie Marfa fixie wayfarers, Pinterest trust fund fanny pack 3 wolf moon dreamcatcher. Echo Park chillwave jean shorts ugh. IPhone Terry Richardson letterpress, literally keytar scenester kale chips tumblr dreamcatcher deep v.</p>
			</div>			
		</div>

		<hr class="medium">


		<!-- Wide -->
		<div class="sixteen columns content">

			<h1>A Beautiful Boilerplate for Responsive, Mobile-Friendly Development</h1>
			<hr class="large">

			<div class="doc-section" id="whatAndWhy">

				<h3>What Is It?</h3>
				<p>Skeleton is a small collection of CSS files that can help you rapidly develop sites that look beautiful at any size, be it a 17" laptop screen or an iPhone. Skeleton is built on three core principles:</p>

				<div class="row clearfix">
					<div class="four columns alpha">
						<img src="images/guide-responsive.jpg" alt="responsive" width="220" height="113">
					</div>
					<div class="eight columns omega">
						<h5>Responsive Grid Down To Mobile</h5>
						<p>Skeleton has a familiar, lightweight 960 grid as its base, but elegantly scales down to downsized browser windows, tablets, mobile phones (in landscape and portrait). <strong>Go ahead, resize this page!</strong></p>
					</div>
				</div>

				<div class="row clearfix">
					<div class="four columns alpha">
						<img src="images/guide-fast.jpg" alt="responsive" width="220" height="113">
					</div>
					<div class="eight columns omega">
						<h5>Fast to Start</h5>
						<p>Skeleton is a tool for rapid development. Get started fast with CSS best practices, a well-structured grid that makes mobile consideration easy, an organized file structure and super basic UI elements like lightly styled forms, buttons, tabs and more.</p>
					</div>
				</div>

				<div class="row clearfix">
					<div class="four columns alpha">
						<img src="images/guide-foundation.jpg" alt="responsive" width="220" height="113">
					</div>
					<div class="eight columns omega">
						<h5>Style Agnostic</h5>
						<p>Skeleton is not a UI framework. It's a development kit that provides the most basic styles as a foundation, but is ready to adopt whatever your design or style is.</p>
					</div>
				</div>

			</div>
			<hr>


			<!-- The Grid 
			================================================== -->
			<div class="doc-section clearfix" id="grid">

				<h3>Two Item Grid</h3>
				<p>Skeleton's base grid is a variation of the 960 grid system. The syntax is simple and it's effective cross browser, but the awesome part is that it also has the flexibility to go mobile like a champ. <strong>Go ahead, resize the browser and watch as the layout reacts!</strong></p>

				<div class="example-grid">
					
					<div class="one column alpha">One</div>
					<div class="fifteen columns omega">Fifteen</div>

					<div class="two columns alpha">Two</div>
					<div class="fourteen columns omega">Fourteen</div>

					<div class="three columns alpha">Three</div>					
					<div class="thirteen columns omega">Thirteen</div>

					<div class="four columns alpha">Four</div>					
					<div class="twelve columns omega">Twelve</div>

					<div class="five columns alpha">Five</div>					
					<div class="eleven columns omega">Eleven</div>

					<div class="six columns alpha">Six</div>					
					<div class="ten columns omega">Ten</div>

					<div class="seven columns alpha">Seven</div>					
					<div class="nine columns omega">Nine</div>

					<div class="eight columns alpha">Eight</div>					
					<div class="eight columns omega">Eight</div>

					<div class="nine columns alpha">Nine</div>					
					<div class="seven columns omega">Seven</div>					

					<div class="ten columns alpha">Ten</div>
					<div class="six columns omega">Six</div>					

					<div class="eleven columns alpha">Eleven</div>
					<div class="five columns omega">Five</div>

					<div class="twelve columns alpha">Twelve</div>									
					<div class="four columns omega">Four</div>					

					<div class="thirteen columns alpha">Thirteen</div>
					<div class="three columns omega">Three</div>				

					<div class="fourteen columns alpha">Fourteen</div>
					<div class="two columns omega">Two</div>

					<div class="fifteen columns alpha">Fifteen</div>
					<div class="one column omega">One</div>
				</div>
				<hr>


				<h3>Three Item Grid</h3>
				<p>These are examples of the grid with three columns.</p> 

				<div class="example-grid">
					<div class="seven columns alpha">Seven</div>
					<div class="two columns">Two</div>
					<div class="seven columns omega">Seven</div>

					<div class="six columns alpha">Six</div>
					<div class="four columns">Four</div>
					<div class="six columns omega">Six</div>

					<div class="five columns alpha">Five</div>
					<div class="six columns">Six</div>
					<div class="five columns omega">Five</div>

					<div class="four columns alpha">Four</div>
					<div class="eight columns">Eight</div>
					<div class="four columns omega">Four</div>

					<div class="three columns alpha">Three</div>
					<div class="ten columns">Ten</div>
					<div class="three columns omega">Three</div>

					<div class="two columns alpha">Two</div>
					<div class="twelve columns">Twelve</div>
					<div class="two columns omega">Two</div>		
				
					<div class="one columns alpha">One</div>
					<div class="fourteen columns">Fourteen</div>
					<div class="one columns omega">One</div>				
				</div>
				
				<p>&nbsp;</p>
				
				<div class="example-grid">
					<div class="eight columns alpha">Eight</div>					
					<div class="six columns">Six</div>
					<div class="two columns omega">Two</div>

					<div class="six columns alpha">Six</div>					
					<div class="six columns">Six</div>
					<div class="four columns omega">Four</div>

					<div class="four columns alpha">Four</div>					
					<div class="eight columns">Eight</div>
					<div class="four columns omega">Four</div>
				</div>
				<hr>

				<h3>Four Item Grid</h3>
				<p>These are examples of the grid with four columns.</p> 

				<div class="example-grid">
					<div class="four columns alpha">Four</div>					
					<div class="four columns">Four</div>
					<div class="four columns">Four</div>					
					<div class="four columns omega">Four</div>

					<div class="three columns alpha">Three</div>					
					<div class="five columns">Five</div>
					<div class="five columns">Five</div>				
					<div class="three columns omega">Three</div>
				</div>

				<div class="hidden-code">
					<a href="">Code Example</a>
					<script src="https://gist.github.com/959632.js?file=Skeleton%20Grid"></script>
				</div>

			</div>
			<hr>


			<!-- Typography
			================================================== -->
			<div class="doc-section clearfix" id="typography">
				<h3>Typography</h3>
				<p>The typography of Skeleton is designed to create a strong hierarchy with basic styles. The primary font is the classic Helvetica Neue, but the font stack can be easily changed with just a couple adjustments. Regular paragraphs are set at a 14px base with 21px line height.</p>
				<div class="row">
					<div class="seven columns alpha headings">
						<h1>Heading &lt;h1&gt;</h1>
						<h2>Heading &lt;h2&gt;</h2>
						<h3>Heading &lt;h3&gt;</h3>
						<h4>Heading &lt;h4&gt;</h4>
						<h5>Heading &lt;h5&gt;</h5>
						<h6>Heading &lt;h6&gt;</h6>
					</div>
					<div class="five columns omega">
						<blockquote>
							<p>This is a blockquote style example. It stands out, but is awesome</p>
							<cite>Dave Gamache, Skeleton Creator</cite>
						</blockquote>
					</div>
				</div>
				<div class="hidden-code">
					<a href="">Code Example</a>
					<script src="https://gist.github.com/973460.js?file=typography"></script>
				</div>
			</div>
			<hr>


			<!-- Buttons
			================================================== -->
			<div class="doc-section" id="buttons">
				<h3>Buttons</h3>
				<p>Buttons are intended for action and thus should have appropriate weight. The standard button is given that weight with a little bit of depth and a strong hover.</p>

				<div class="add-bottom">
					<h5>Normal</h5>
					<a href="#buttons" class="button-primary" onclick="javascript:alert('This button uses .button-primary class')">Button Primary</a>
					<a href="#buttons" class="button-secondary" onclick="javascript:alert('This button uses .button-secondary class')">Button Secondary</a>
					<a href="#buttons" class="button-alert" onclick="javascript:alert('This button uses .button-alert class')">Button Alert</a>
					<a href="#buttons" class="button-warning" onclick="javascript:alert('This button uses .button-warning class')">Button Warning</a>
				</div>

				<div class="add-bottom">			
					<h5>With Icons</h5>
					<a href="#buttons" class="button-primary" onclick="javascript:alert('This button uses .button-primary class')"><span class="icon-community"></span> Button Primary</a>
					<a href="#buttons" class="button-secondary" onclick="javascript:alert('This button uses .button-secondary class')"><span class="icon-brain"></span> Button Secondary</a>
				</div>

				<div class="hidden-code">
					<a href="">Code Example</a>
					<script src="https://gist.github.com/973448.js?file=buttons"></script>
				</div>
			</div>
			<hr>


			<!-- Forms
			================================================== -->
			<div class="doc-section clearfix" id="forms">
				<h3>Forms</h3>
				<p>Forms can be one of the biggest pains for web developers, but just use these dead simple styles and you should be good to go. </p>
				<div class="four columns alpha">
					<form>
						<label for="regularInput">Regular Input</label>
						<input type="text" id="regularInput">
						<label for="regularTextarea">Regular Textarea</label>
						<textarea id="regularTextarea"></textarea>
						<label for="selectList">Select List</label>
						<select id="selectList">
							<option value="Option 1">Option 1</option>
							<option value="Option 2">Option 2</option>
							<option value="Option 3">Option 3</option>
							<option value="Option 4">Option 4</option>
						</select>
						<fieldset>
							<legend>Checkboxes</legend>
							<label for="regularCheckbox">
								<input type="checkbox" id="regularCheckbox" value="checkbox 1">
								<span>Regular Checkbox</span>
							</label>
							<label for="secondRegularCheckbox">
								<input type="checkbox" id="secondRegularCheckbox" value="checkbox 2">
								<span>Regular Checkbox</span>
							</label>
						</fieldset>
						<fieldset>
							<legend>Radio Buttons</legend>
							<label for="regularRadio">
								<input type="radio" name="radios" id="regularRadio" value="radio 1">
								<span>Regular Radio</span>
							</label>
							<label for="secondRegularRadio">
								<input type="radio" name="radios" id="secondRegularRadio" value="radio 2">
								<span>Regular Radio</span>
							</label>
						</fieldset>
						<button type="submit">Submit Form</button>
					</form>
				</div>
				<br class="clear">
				<div class="hidden-code">
					<a href="">Code Example</a>
					<script src="https://gist.github.com/973455.js?file=forms"></script>
				</div>
			</div>
			<hr>


			<!-- Media Queries
			================================================== -->
			<div class="doc-section" id="mediaQueries">
				<h3>Media Queries</h3>
				<p>Skeleton uses a <strong>lot</strong> of media queries to serve the scalable grid, but also for the convenience of styling your site on different size screens. Skeleton's media queries are almost exclusively targeted at max and min widths rather than device sizes or orientations. The advantage of this is browsers and future mobile devices that don't map to exact set dimensions will still benefit from the styles. That being said, all of the queries were written to be optimal on Apple iOS devices. The built in media queries include:</p>
				<ul class="square">
					<li><strong>Smaller than 960</strong>: Smaller than the standard base grid</li>
					<li><strong>Tablet Portrait</strong>: Between 768px and 959px</li>
					<li><strong>All Mobile Sizes</strong>: Less than 767px</li>
					<li><strong>Just Mobile Landscape</strong>: Between 480px and 767px</li>
					<li><strong>Just Mobile Portrait</strong>: Less than 479px</li>
				</ul>
				<div class="hidden-code">
					<a href="">Code Example</a>
					<script src="https://gist.github.com/973467.js?file=media%20queries"></script>
				</div>
			</div>


			<!-- Color Palate
			================================================== -->
			<div class="doc-section" id="colorPalate">
				<h3>Color Palate</h3>
				<p>Click square to copy HEX color value to clipboard</p>

				<div class="color-palate-item" style="background-color:#005283">
					@blueDarkest
				</div>
				<div class="color-palate-item" style="background-color:#3d6088">
					@blueDarker
				</div>
				<div class="color-palate-item" style="background-color:#006daf">
					@blueDark
				</div>
				<div class="color-palate-item" style="background-color:#41c2ff">
					@blue
				</div>
				<div class="color-palate-item" style="background-color:#99d9ff">
					@blueLight
				</div>
				<div class="color-palate-item" style="background-color:#92a3bf">
					@grayLight
				</div>
				<div class="color-palate-item" style="background-color:#8596b3">
					@gray
				</div>
				<div class="color-palate-item" style="background-color:#7f90ac">
					@grayDark
				</div>
				<div class="color-palate-item" style="background-color:#C94D35">
					@red
				</div>
				<div class="color-palate-item" style="background-color:#713c2a">
					@redBorder
				</div>
				<div class="color-palate-item" style="background-color:#9e6727">
					@orange
				</div>
				<div class="color-palate-item" style="background-color:#826f69">
					@brown
				</div>
				<div class="color-palate-item" style="background-color:#7ba2a7">
					@greenDark
				</div>
				<div class="color-palate-item" style="background-color:#abc78a">
					@green
				</div>
				<div class="color-palate-item" style="background-color:#e2e8e3">
					@greenLight
				</div>
				<div class="color-palate-item" style="background-color:#b0b1b2">
					@greenLightBorder					
				</div>
				<div id="color-palate-copy"></div>
			</div>

	</div><!-- container -->


	<!-- JS ================================================== -->
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script type="text/javascript" src="http://jonrohan.github.io/ZeroClipboard/javascripts/ZeroClipboard.js" ></script>
	<script type="text/javascript">

		$('.gist').hide();

		$('.hidden-code').click(function(e) {
			e.preventDefault();
			$(this).children('.gist').slideToggle();
		})

		var originalText;
		$('.example-grid').children().hover(
			function() {
				originalText = $(this).text();
				$(this).html($(this).width()+'px');
			},
			function() {
				$(this).html(originalText);
			}
		);



		$('.color-palate-item').on('click', function() {

			var rgb_color = $(this).css('background-color'),
			rgb_color = rgb_color.replace('rgb(', ''),
			rgb_color = rgb_color.replace(')', '');
		
			var rgb = rgb_color.split(', ');
			var hex = "#" + ((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1);

			alert('HEX Color is: ' + hex);
		});
	
	</script>

</body>
</html>

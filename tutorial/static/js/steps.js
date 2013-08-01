// Generated by CoffeeScript 1.6.2
/*
  This is the main script file. It can attach to the terminal
*/


/*
  Register the things
*/


(function() {
  var EVENT_TYPES, buildfunction, current_question, currentquestion, err, f, leaveFullSizeMode, logEvent, next, previous, q, question, questions, results, stateObj, _i, _len;

  this.webterm = $('#terminal').terminal(interpreter, basesettings);

  /*
    Start with the questions
  */


  questions = [];

  EVENT_TYPES = {
    none: "none",
    start: "start",
    command: "command",
    next: "next",
    feedback: "feedback",
    complete: "complete"
  };

  stateObj = {
    foo: "bar"
  };

  current_question = 0;

  next = function() {
    var data;

    current_question++;
    questions[current_question]();
    results.clear();
    this.webterm.focus();
    if (!$('#commandShownText').hasClass('hidden')) {
      $('#commandShownText').addClass("hidden");
      $('#commandHiddenText').removeClass("hidden").show();
    }
    history.pushState(stateObj, "", "#" + current_question);
    data = {
      'type': EVENT_TYPES.next
    };
    logEvent(data);
  };

  previous = function() {
    current_question--;
    questions[current_question]();
    results.clear();
    this.webterm.focus();
  };

  results = {
    set: function(htmlText, intermediate) {
      if (intermediate) {
        console.debug("intermediate text received");
        $('#results').addClass('intermediate');
        $('#buttonNext').hide();
      } else {
        $('#buttonNext').show();
      }
      return window.setTimeout((function() {
        $('#resulttext').html(htmlText);
        $('#results').fadeIn();
        return $('#buttonNext').removeAttr('disabled');
      }), 300);
    },
    clear: function() {
      $('#resulttext').html("");
      return $('#results').fadeOut('slow');
    }
  };

  logEvent = function(data, feedback) {
    var ajax_load, callback, loadUrl;

    ajax_load = "loading......";
    loadUrl = "/tutorial/api/";
    if (!feedback) {
      callback = function(responseText) {
        return $("#ajax").html(responseText);
      };
    } else {
      callback = function(responseText) {
        results.set("Thank you for your feedback! We appreciate it!", true);
        return $("#ajax").html(responseText);
      };
    }
    if (!data) {
      data = {
        type: EVENT_TYPES.none
      };
    }
    data.question = current_question;
    $("#ajax").html(ajax_load);
    return $.post(loadUrl, data, callback, "html");
  };

  /*
    Array of question objects
  */


  q = [];

  q.push({
    html: "<h2>Getting started</h2>\n<p>There are actually two programs, a Docker daemon, it manages al the containers, and the Docker client.\nThe client acts as a remote control on the daemon. On most systems, like in this emulation, both run on the\nsame host.</p>",
    assignment: "<h2>Assignment</h2>\n<p>Check which Docker version is running</p>\n<p>This will help you verify the daemon is running. If you see which version is running you know you are all set.</p>",
    tip: "try typing `docker` to see the full list of accepted arguments",
    command_expected: ['docker', 'version'],
    result: "<p>Well done! Let's move to the next assignment.</p>"
  });

  q.push({
    html: "<h2>Searching for images</h2>\n<p>The easiest way of getting started is to use a container image from someone else. Container images are\navailable on the docker index and can be found using <em>docker search</em></p>",
    assignment: "<h2>Assignment</h2>\n<p>Please search for an image called tutorial</p>",
    command_expected: ['docker', 'search', 'tutorial'],
    result: "<p>You found it!</p>",
    tip: "the format is `docker search &lt;string&gt;`"
  });

  q.push({
    html: "<h2>Downloading container images</h2>\n<p>Container images can be downloaded just as easily, using <em>docker pull.</em></p>\n<p>The name you specify is made up of two parts: the <em>username</em> and the <em>repository name</em>,\ndivided by a slash `/`.</p>\n<p>A group of special, trusted images can be retrieved by just their repository name.</p>",
    assignment: "<h2>Assignment</h2>\n<p>Please download the tutorial image you have just found</p>",
    command_expected: ['docker', 'pull', 'learn/tutorial'],
    result: "<p>Cool. Look at the results. You'll see that docker has downloaded a number of layers. In Docker all images (except the base image) are made up of several cumulative layers.</p>",
    tip: "Don't forget to pull the full name of the repository e.g. 'learn/tutorial'"
  });

  q.push({
    html: "<h2>Hello world from a container</h2>\n<p>You should think about containers as an operating system in a box, except they do not need to be booted\nbefore you can run commands in them. Instead, they are started <em>by</em> running a process in them. They\nalso stop as soon as the process completes<p>",
    assignment: "<h2>Assignment</h2>\n<p>Make our freshly loaded container image output \"hello world\"</p>",
    command_expected: ["docker", "run", "learn/tutorial", "echo"],
    command_show: ["docker", "run", "learn/tutorial", 'echo "hello world"'],
    result: "<p>Great! Hellooooo World!</p>",
    intermediateresults: ["<p>You seem to be almost there. Did you give the command `echo \"hello world\"` ", "<p>You've got the arguments right. Did you get the command? Try <em>/bin/bash </em>?</p>"],
    tip: " <p>The command `docker run` takes two arguments. An image name, and the command you want to execute within that\nimage.</p>"
  });

  q.push({
    html: "<h2>Installing things in the container</h2>\n<p>Next we are going to install a simple program in the container. The image is based upon ubuntu, so we give the command\n“apt-get install -y ping”. Docker will run this command in the container and exit when done.</p>",
    assignment: "<h2>Assignment</h2>\n<p>Install 'ping' inside of the container.</p>",
    command_expected: ["docker", "run", "learn/tutorial", "apt-get", "install", "-y", "ping"],
    result: "<p>That worked!</p>",
    intermediateresults: ["<p>Not specifieng -y on the apt-get install command will work for ping, because it has no other dependencies, but\nit will fail when apt-get wants to install dependencies. To get into the habit, please add -y after apt-get.</p>"],
    tip: "don't forget to use -y for noninteractive mode installation"
  });

  q.push({
    html: "<h2>Save your changes</h2>\n<p>After you make changes (by running a command inside a container) you probably want to save those changes.\nThis will enable you to later start from this point (savepoint) onwards.</p>\n<p>With Docker, the process of saving the state is called <em>committing</em>. Commit basically saves the difference\nbetween the old image and the new state. The result is a new layer.</p>",
    assignment: "<h2>Assignment</h2>\n<p>First use <em>docker ps -l</em> to find the ID of the container you created by installing ping.</p>\n<p>And then save (commit) this container with the repository name `learn/ping` </p>",
    command_expected: ["docker", "commit", 'learn/ping'],
    command_show: ["docker", "commit", "6982a9948422", 'learn/ping'],
    result: "<p>That worked! Please take note that Docker has returned a new ID. This id is the <em>image id</em>.\nYou will need it next.</p>",
    intermediateresults: ["You have not specified a repository name. This is not wrong, but giving your images a name\nmake them much easier to work with."],
    tip: "<ul>\n<li>Giving just 'docker commit' will show you the possible arguments.</li>\n<li>You don't need to copy the entire ID - as long your input identifies the image. Three or four characters\nis usually enough.</li>\n</ul>"
  });

  q.push({
    html: "<h2>Run your new image</h2>\n<p>Now you have basically setup a complete, self contained environment with the 'ping' program installed. </p>\n<p>Your image can now be run on any host that runs docker.</p>\n<p>Lets run this image on this machine.</p>",
    assignment: "<h2>Assignment</h2>\n<p>Run the ping program to ping www.google.com</p>\n",
    command_expected: ["docker", "run", 'learn/ping', 'ping', 'www.google.com'],
    result: "<p>That worked! Note that normally you can use Ctrl-C to disconnect. The container will keep running. This\ncontainer will disconnect automatically.</p>",
    intermediateresults: ["You have not specified a repository name. This is not wrong, but giving your images a name\nmake them much easier to work with."],
    tip: "<ul>\n<li>Make sure to use the repository name learn/ping to run ping with</li>\n</ul>"
  });

  q.push({
    html: "<h2>Check your running image</h2>\n<p>You now have a running container. Let's see what is going on.</p>\n<p>Using <em>docker ps</em> we can see a list of all running containers, and using <em>docker inspect</em>\nwe can see all sorts of usefull information about this container.</p>",
    assignment: "<h2>Assignment</h2>\n<p><em>Find the container id</em> of the running container, and then inspect the container using <em>docker inspect</em>.</p>\n",
    command_expected: ["docker", "inspect", "efe"],
    result: "<p>Success! Have a look at the output. You can see the ip-address, status and other information.</p>",
    intermediateresults: ["You have not specified a repository name. This is not wrong, but giving your images a name\nmake them much easier to work with."],
    tip: "<ul>\n<li>Remember you can use a partial match of the image id</li>\n</ul>"
  });

  q.push({
    html: "<h2>Push the image to the registry</h2>\n<p>Now you have verified that your new application container works as it should, you can share it.</p>\n<p>Docker comes with a complete image sharing service, you can push your image there for yourself and others\nto retrieve.</p>",
    assignment: "<h2>Assignment</h2>\n<p>Push your container image to the repository</p>\n",
    command_expected: ["docker", "push"],
    command_show: ["docker", "push", "learn/ping"],
    result: "<p>Yeah! You are all done!</p>",
    intermediateresults: [" "],
    tip: "<ul>\n<li>Docker images will show you which images are currently on your host</li>\n<li>You can only push images to your own namespace.</li>\n<li>For this tutorial we assume you are already logged in as the 'learn' user..</li>\n</ul>"
  });

  q.push({
    html: "<h2>Interactive Shell</h2>\n<p>Now, since Docker provides you with the equivalent of a complete operating system you are able to get\nan interactive shell (tty) <em>inside</em> of the container.</p>\n<p>Since we want a prompt in the container, we need to start the shell program in the container. </p>\n<p>You may never have manually started it before, but a popular one typically lives at `/bin/bash`</p>",
    assignment: "<h2>Assignment</h2>\n<p>Your goal is to run the tutorial container you have\njust downloaded and get a shell inside of it.</p>",
    command_expected: ["docker", "run", "-i", "-t", "learn/tutorial", "/bin/bash"],
    result: "<p>Great!! Now you have an interactive terminal</p>",
    intermediateresults: ["<p>You seem to be almost there. Did you use <em>-i and -t</em>?</p>", "<p>You've got the arguments right. Did you get the command? Try <em>/bin/bash </em>?</p>", "<p>You have the command right, but the shell exits immediately, before printing anything</p>\n<p>You will need to attach your terminal to the containers' terminal.</p>"],
    tip: "Start by looking at the results of `docker run`, it shows which arguments exist"
  });

  /*
    Transform question objects into functions
  */


  buildfunction = function(q) {
    var _q;

    _q = q;
    return function() {
      console.debug("function called");
      $('#instructions').hide().fadeIn();
      $('#instructions .text').html(_q.html);
      $('#instructions .assignment').html(_q.assignment);
      $('#tipShownText').html(_q.tip);
      if (_q.command_show) {
        $('#commandShownText').html(_q.command_show.join(' '));
      } else {
        $('#commandShownText').html(_q.command_expected.join(' '));
      }
      window.immediateCallback = function(input, stop) {
        var data, doNotExecute;

        if (stop === true) {
          doNotExecute = true;
        } else {
          doNotExecute = false;
        }
        if (doNotExecute !== true) {
          console.log(input);
          data = {
            'type': EVENT_TYPES.command,
            'command': input.join(' '),
            'result': 'fail'
          };
          if (input.containsAllOfTheseParts(_q.command_expected)) {
            data.result = 'success';
            setTimeout((function() {
              this.webterm.disable();
              return $('#buttonNext').focus();
            }), 1000);
            results.set(_q.result);
            console.debug("contains match");
          } else {
            console.debug("wrong command received");
          }
          logEvent(data);
        } else {

        }
      };
      window.intermediateResults = function(input) {
        var intermediate;

        return results.set(_q.intermediateresults[input], intermediate = true);
      };
    };
  };

  for (_i = 0, _len = q.length; _i < _len; _i++) {
    question = q[_i];
    f = buildfunction(question);
    questions.push(f);
  }

  /*
    Initialization of program
  */


  if (window.location.hash) {
    try {
      currentquestion = window.location.hash.split('#')[1].toNumber();
      questions[currentquestion]();
      current_question = currentquestion;
    } catch (_error) {
      err = _error;
      questions[0]();
    }
  } else {
    questions[0]();
  }

  $('#results').hide();

  /*
    Event handlers
  */


  $('#buttonNext').click(function() {
    next();
    return $('#results').hide();
  });

  $('#buttonPrevious').click(function() {
    previous();
    return $('#results').hide();
  });

  $('#feedbackSubmit').click(function() {
    var data, feedback;

    feedback = $('#feedbackInput').val();
    data = {
      type: EVENT_TYPES.feedback,
      feedback: feedback
    };
    return logEvent(data, feedback = true);
  });

  $('#fullSizeOpen').click(function() {
    return goFullScreen();
  });

  this.goFullScreen = function() {
    var data;

    console.debug("going to fullsize mode");
    $('.togglesize').removeClass('startsize').addClass('fullsize');
    $('.hide-when-small').css({
      display: 'inherit'
    });
    $('.hide-when-full').css({
      display: 'none'
    });
    webterm.resize();
    data = {
      type: EVENT_TYPES.start
    };
    return logEvent(data);
  };

  $('#fullSizeClose').click(function() {
    return leaveFullSizeMode();
  });

  leaveFullSizeMode = function() {
    console.debug("leaving full-size mode");
    $('.togglesize').removeClass('fullsize').addClass('startsize');
    $('.hide-when-small').css({
      display: 'none'
    });
    $('.hide-when-full').css({
      display: 'inherit'
    });
    return webterm.resize();
  };

  $('#command').click(function() {
    if (!$('#commandHiddenText').hasClass('hidden')) {
      $('#commandHiddenText').addClass("hidden").hide();
      return $('#commandShownText').hide().removeClass("hidden").fadeIn();
    }
  });

}).call(this);

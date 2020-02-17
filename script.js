window.onload = function(){

    const file = document.getElementById("file-input");
    const canvas = document.getElementById("canvas");
    const h3 = document.getElementById("name");
    const audio = document.getElementById("audio");

    file.onchange = function(){

        const files = this.files; //FileList containing File objects selected by the user (Dom File API)
        let mp3 = files[0];
        console.log('FILES[0]: ', mp3)
        audio.src = URL.createObjectURL(mp3); // Creates a DOMString containing the specified File Object


        const name = mp3.name;
        h3.innerText = `${name}` // sets <h3> to the name of the file

        /////<CANVAS> INITIALIZATION///////
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");
        /////////////////////////////////////

        ///////// WEB AUDIO API/////////////
        const context = new AudioContext(); // (Interface) Audio-Processing Graph
        let src = context.createMediaElementSource(audio); // Give the audio context an audio source, to which then 
        //can be played and manipulated
        const analyzer = context.createAnalyser(); // Create and anazlyzer for the audio context

        src.connect(analyzer); // Connects the audio context source to the analyzer
        analyzer.connect(context.destination); // End destination of an audio graph in a given
        //context. Sends sound to the speakers or headphones
        /////////////////////////////////////

        analyzer.fftSize = 16384;
        // (FFT) is an algorithm that smaple a signal over a period of time
        // and divides it into its frequency components (single sinusodial oscillations).
        // It separates the mixed signals and shows what frequency is a violant vibration
        // Look up different fft sizes and try them out!

        // (FFTSize) represents the window size in samples that is used when performing a FFT
        // Lower the size, the less bars (but wider in size)
        ///////////////////////////////////////////////////////

        const bufferLength = analyzer.frequencyBinCount; // (read-only property
        // Unsigned interger, half of fftSize (so in this case, bufferLength = 8192)
        // Equates to number of data values you hsve to play with for the visualization

        // The FFT size defines the number of bins used for dividing the window into eqial strips, or bins.
        // Hence, a bin is a spectrum sample, and defines the frequency resolution of the window

        const dataArray = new Uint8Array(bufferLength); // Converts to 8-bit unsigned interger array
        // At this point dataArray is an array with length of bufferLength but no values

        console.log('DATA ARRAY: ', dataArray); // Check out this array of frequency values!

        // MAKING OUR BAR WIDTH & HEIGHT //
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;
        console.log('WIDTH: ', WIDTH, 'HEIGHT: ', HEIGHT);

        const barWidth = (WIDTH / bufferLength) * 13;
        console.log('BARWIDTH: ', barWidth);

        console.log('TOTAL WIDTH: ', (117 * 10) + (118 * barWidth)); // (total space between bars) + (total width of bars)

        let barHeight;
        let x = 0;

        function renderFrame(){
            requestAnimationFrame(renderFrame); // Takes callback function to invoke before rendering
            x = 0;
            analyzer.getByteFrequencyData(dataArray); // Copies the frequency data into dataArray
            // Results in a normalized array of values between 0 and 255
            // Before this step, dataArray's values are all zeros (but with an array length of 8192)

            // making gradient test
            let gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);



            ctx.fillStyle = "rgba(0,0,0,0.2)"; // Clears canvas before rendering bars (black with an opacity of 0.2)
            ctx.fillRect(0, 0, WIDTH, HEIGHT); // Fade effect, set opacity to 1 for sharper rendering of bars

            // making bars
            let r, g, b;
            let bars = 118; // set total number of bars per frame

            for (let i = 0; i < bars; i++) {
                barHeight = (dataArray[i] * 2.5);

                if (dataArray[i] > 200) { // white
                    r = 255;
                    g = 255;
                    b = 255;
                }

                if (dataArray[i] < 195) { // red
                    r = 235;
                    g = 52;
                    b = 52;
                }

                if (dataArray[i] < 170) { // pink
                    r = 235;
                    g = 52;
                    b = 140;
                }

                if (dataArray[i] < 160) { // orange
                    r = 235;
                    g = 171;
                    b = 52;
                }

                if (dataArray[i] < 140) { // yellow/green
                    r = 232;
                    g = 235;
                    b = 52;
                }

                if (dataArray[i] < 130) { // light green
                    r = 52;
                    g = 235;
                    b = 119;
                }

                if (dataArray[i] < 120) { // light blue
                    r = 52;
                    g = 196;
                    b = 235;
                }

                if (dataArray[i] < 110) { // medium blue
                    r = 52;
                    g = 88;
                    b = 235;
                }
                console.log("R: ", r, "G: ", g, "B: ", b);

                //testing the gradient
                gradient.addColorStop(0, 'blue');
                gradient.addColorStop(1, `rgb(${r},${g},${b})`);
                ctx.fillStyle = gradient;

                //OLD FILLSTYLE (each bar diff color)
                //ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, (HEIGHT - barHeight), barWidth, barHeight);
                // (x, y, i, j)
                // (x, y) represents start point
                // (i, j) represents end point

                x += barWidth + 10 // gives 10px space between each bar

            }


        }

        audio.play();
        renderFrame();


    }






















}
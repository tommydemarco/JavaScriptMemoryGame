//MEMORY GAME WITH TIMER AND RECORD FEATURES
//coded with love by Tommy De Marco

//MEMORYGAME object
var MEMORYGAME = {};

//creation of the namespace
(function(memorygame){

    //defining the const
    const gameBoard = document.getElementsByClassName('memory-canvas')[0]
    const memoryCards = document.querySelectorAll(".single-card");
    const memoryMessageBox = document.getElementById("memory-message-box");
    const counterBox = document.getElementById("initial-counter");
    const outputTimerBox = document.getElementById('output');
    const recordDescriptionBox = document.getElementById('record-description');

    //defining the let variables
    let hasFlippedCard = false;
    let gameStill = false;
    let firstCard, secondCard;
    let matchCounter = 0;
    let firstClick = false;
    let record = "No record yet";
    let time = 0;
    let running = false;
    let oldRecord;

    //CONFETTI ANIMATION VARIABLES  
    let canvas = document.getElementById('confetti-canvas');
    
    canvas.width = screen.width;
    canvas.height = screen.height;

    let ctx = canvas.getContext('2d');
    let confetti = [];
    let numberOfConfetti = 400;

    //MAIN CONFETTI FUNCTION
    function confettiFunction(){

        //function to color the confetti with a random color in the list
        function colorTheseConfetti(){
            let colors = ['#e67e22', '#f1c40f', '#f39c12', '#d35400', '#f1c40f', '#f1c40f', '#f1c40f'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        //defining the time variable of the start of the animation
        let lastUpdateTime = Date.now();

        //confetti functions
        function updateConfetti(){
            let now = Date.now(),
                dt = now - lastUpdateTime;

            for(let i = confetti.length - 1; i >= 0; i--){
                let p = confetti[i];

                if (p.y > canvas.height){
                    confetti.splice(i, 1);
                    continue;
                }

                p.y += p.gravity * dt;
                p.rotation += p.rotationSpeed * dt;
            }


            lastUpdateTime = now;

            setTimeout(updateConfetti, 1);
        }

        function deployConfetti(){
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            confetti.forEach(function(p){
                ctx.save();
                ctx.fillStyle = p.color;
                ctx.translate(p.x + p.size / 2, p.y + p.size / 2);
                ctx.rotate(p.rotation);
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });

            requestAnimationFrame(deployConfetti)
        }

        //AMAZING CONFETTI CONSTRUCTOR
        function ConfettiPiece(x, y){
            this.x = x;
            this.y = y;
            this.size = (Math.random() * 0.5 + 0.80) * 15;
            this.gravity = (Math.random() * 2.3 + 0.80) * 0.45;
            this.rotation = (Math.PI * 2) * Math.random();
            this.rotationSpeed = (Math.PI * 2) * Math.random() * 0.001;
            this.color = colorTheseConfetti();
        }

        //creating the confetti pieces with the constructor
        while (confetti.length < numberOfConfetti) {
            confetti.push(new ConfettiPiece(Math.random() * canvas.width, -300));
        }

        updateConfetti();
        deployConfetti();

    }



    //function that is triggered every time a card is clicked 
    function rotateCard(){

        if (running){

        } else {
            running = true;
            incrementTime();
        }

        //prevents the clicking of another card when two other cards are being displayed
        if (gameStill) {
            return
        }
        //prevents the double clicking on the same card
        if (this === firstCard) {
            memoryMessageBox.innerHTML = "Ok, got it, now pick another one";
            memoryMessageBox.style.color = '#1abc9c';
            return
        }

        //displaying the inner face of a card 
        this.classList.add('rotate');
        //determining if this is the first of the two choices being clicked
        if (!hasFlippedCard){
            hasFlippedCard = true;
            firstCard = this;
        } else {
            //if it's the second option, setting the this to the second card and
            //calling the function that verifies if the two cards are the same card 
            hasFlippedCard = false;
            secondCard = this;
            //calling the function that checks if the two cards are the same card 
            matchChecking();       
        }
    }

    //defining the function that checkes if the two cards picked are the same card 
    function matchChecking(){
        if (firstCard.dataset.card === secondCard.dataset.card){
            //if the two cards are actually the same 
            isAMatch();
        } else {
            notAMatch();
        }
    }

    function isAMatch(){
        memoryMessageBox.innerHTML = "Hurray, you got it!";
        memoryMessageBox.style.color = '#1abc9c';
        firstCard.removeEventListener('click', rotateCard);
        secondCard.removeEventListener('click', rotateCard);
        matchCounter++;
        counterBox.innerHTML = matchCounter;
        if (matchCounter === 6) {
            memoryMessageBox.innerHTML = "YOU WON THE GAME!";
            running = false;
            time = 0;
            recordDescriptionBox.innerHTML = "Your record is:";
            record = document.getElementById('output').innerHTML;
            oldRecord = document.getElementById('record').innerText;
            console.log(record);
            console.log(oldRecord);
            if (record < oldRecord){
                document.getElementById('record').innerHTML = record;
                document.getElementById('record').style.display = "block";
            }
            canvas.style.display = "block";
            confettiFunction();
            setTimeout(function(){
                canvas.style.display = "none";
            },2700)
        }


        resetChoices();
    }

    function notAMatch(){
        gameStill= true
        memoryMessageBox.innerHTML = "Oooops, incorrect, try again!";
        memoryMessageBox.style.color = '#f39c12';
        setTimeout(() => {
            firstCard.classList.remove('rotate');
            secondCard.classList.remove('rotate');
            
            resetChoices();
        }, 1200);
    }

    function resetChoices(){
        hasFlippedCard = false;
        gameStill = false;
        firstCard = null;
        secondCard = null;
    }

    //shuffles the cards automatically on page load
    (function shuffle(){
        memoryCards.forEach(singleCard => {
            let randomPosition = Math.floor(Math.random() * 12);
            singleCard.style.order = randomPosition;
        })
    })();

    function shuffle(){
        memoryCards.forEach(singleCard => {
            singleCard.classList.remove('rotate');
            setTimeout(function(){
                let randomPosition = Math.floor(Math.random() * 12);
                singleCard.style.order = randomPosition;
                memoryCards.forEach(singleCard => {
                    singleCard.addEventListener('click', rotateCard);
                    matchCounter = 0;
                    running = false;
                    time = 0;
                    memoryMessageBox.innerHTML = "Play the game again!";
                    memoryMessageBox.style.color = '#f1c40f';
                    counterBox.innerHTML = matchCounter;
                });
            }, 500);
        });
    }


    function incrementTime(){
        if (running){
            setTimeout(function(){
                time++;
                var mins = Math.floor(time/10/60);
                var seconds = Math.floor(time/10%60);
                var hours = Math.floor(time/10/60/60);
                if (mins < 10){
                    mins = "0" + mins;
                }
                if (seconds < 10){
                    seconds = "0" + seconds; 
                }
                outputTimerBox.innerHTML = hours + ":" + mins + ":" + seconds;
                incrementTime()

            }, 100)
        }
    }

    

    //assigning to the namespace only the necessary functions 
    memorygame.memoryCards = memoryCards;
    memorygame.rotateCard = rotateCard;
    memorygame.shuffle = shuffle;

})(MEMORYGAME);

MEMORYGAME.memoryCards.forEach(singleCard => singleCard.addEventListener('click', MEMORYGAME.rotateCard));

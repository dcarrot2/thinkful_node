// Progress Bar should have three callbacks
// onStart
// onProgress
// onEnd
// call start() - it should call the onStart callback
// and begin count from 1 to 100. Every 10 items,
// it counts, it should call the onProgress callback
// providing how far along it is an argument
// finally it should call the onEnd callback.

var ProgressBar = function(){
	this.onStartCallback = null;
	this.onProgressCallback = null;
	this.onEndCallback = null;
};

ProgressBar.prototype.onStart = function(callback) {
	console.log("Registered onStart callback");
	this.onStartCallback = callback;
};

ProgressBar.prototype.onProgress = function(callback) {
	console.log("Registered onProgress callback");
	this.onProgressCallback = callback;
};

ProgressBar.prototype.onEnd = function(callback) {
	console.log("Registered onEnd callback");
	this.onEndCallback = callback;
};

ProgressBar.prototype.start = function(){
	this.onStartCallback("Starting...");
};

var ProgressBar = new ProgressBar();
ProgressBar.onStart(function(status){
	console.log('Received on start callback');
	console.log(status);
	for(var i=1; i<=100; i++){
		if(i % 10 === 0){
			this.onProgressCallback(i);
		}
	}
	this.onEndCallback();
});

ProgressBar.onProgress(function(progress){
	console.log("Progress: " + progress + "%");
});

ProgressBar.onEnd(function(){
	console.log("End!");
});

ProgressBar.start();
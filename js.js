class Main {
    constructor() {
        this.canvas = new Canvas().append();
    }
    start() {
        this.screen = new StartScreen(this.canvas).start();
    }
    game(){
        this.screen = new GameScreen(this.canvas).start();
        this.screen.addPlayer(1);
    }
}
var main = new Main();
main.start();
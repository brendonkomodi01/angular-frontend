import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SlotService } from '../../service/slot';
import { InventoryService } from '../../service/inventory';

@Component({
  selector: 'app-slot',
  standalone: false,
  templateUrl: './slot.html',
  styleUrl: './slot.css'
})
export class Slot implements OnInit, OnDestroy {

  coinBalance: number = 0;
  isSpinning: boolean = false;
  message: string = '';
  grid: any[][] = [];
  winningRows: number[] = [];
  winningPositions: number[][] = [];
  stoppingCols: boolean[] = [false, false, false, false, false];
  coinWon: number = 0;
  bet: number = 100;
  betOptions: number[] = [100, 200, 500, 1000];
  showBigWin: boolean = false;
  bigWinAmount: number = 0;
  musicPlaying: boolean = false;
  fastSpinning: boolean = false;
  fastSpinCount: number = 0;
  showFastSpinMenu: boolean = false;
  fastSpinOptions: number[] = [25, 50, 100];
  lightningCols: boolean[] = [false, false, false, false, false];
  chainStep: number = -1;
  expandingCols: number[] = [];
  freeSpinsRemaining: number = 0;
  isFreeSpinMode: boolean = false;
  showFreeSpinIntro: boolean = false;
  pendingFreeSpins: number = 0;
  freeSpinTotalWon: number = 0;
  freeSpinTotalDisplay: number = 0;
  showFreeSpinTotal: boolean = false;
  stickyWilds: {row: number, col: number}[] = [];
  showMegaWin: boolean = false;
  megaWinAmount: number = 0;
  showEpicWin: boolean = false;
  epicWinAmount: number = 0;
  scatterAnimating: boolean = false;
  activeScatterPositions: {row: number, col: number}[] = [];

  paytableLeft: any[] = [
    { name: 'Zeus', image: 'assets/images/zeus.png', multiplier: '15x' },
    { name: 'Medusa', image: 'assets/images/medusa.png', multiplier: '15x' },
    { name: 'Minotaur', image: 'assets/images/minotaur.png', multiplier: '10x' },
    { name: 'Hermes', image: 'assets/images/hermes.png', multiplier: '10x' },
    { name: 'Anubis', image: 'assets/images/anubis.png', multiplier: '8x' },
    { name: 'Ra', image: 'assets/images/ra.png', multiplier: '8x' },
    { name: 'Fenrir', image: 'assets/images/fenrir.png', multiplier: '5x' },
    { name: 'Hydra', image: 'assets/images/hydra.png', multiplier: '5x' },
  ];

  paytableRight: any[] = [
    { name: 'Osiris', image: 'assets/images/osiris.png', multiplier: '5x' },
    { name: 'Odin', image: 'assets/images/odin.png', multiplier: '5x' },
    { name: 'Athena', image: 'assets/images/athena.png', multiplier: '6x' },
    { name: 'Cerberus', image: 'assets/images/cerberus.png', multiplier: '6x' },
    { name: 'Horus', image: 'assets/images/horus.png', multiplier: '6x' },
    { name: 'Valkyrie', image: 'assets/images/valkyrie.png', multiplier: '7x' },
    { name: 'Sphinx', image: 'assets/images/sphinx.png', multiplier: '7x' },
  ];

  allCardImages: string[] = [
    'assets/images/zeus.png', 'assets/images/medusa.png',
    'assets/images/minotaur.png', 'assets/images/hermes.png',
    'assets/images/anubis.png', 'assets/images/ra.png',
    'assets/images/fenrir.png', 'assets/images/hydra.png',
    'assets/images/osiris.png', 'assets/images/odin.png',
    'assets/images/athena.png', 'assets/images/cerberus.png',
    'assets/images/horus.png', 'assets/images/valkyrie.png',
    'assets/images/sphinx.png', 'J', 'Q', 'K', 'A'
  ];

  spinningGrid: string[][] = [];
  spinningCols: boolean[] = [false, false, false, false, false];
  private colIntervals: any[] = [];
  private spinResult: any = null;

  private spinSound = new Audio('assets/sounds/spin.wav');
  private stopSound = new Audio('assets/sounds/stop.wav');
  private winSound = new Audio('assets/sounds/win.mp3');
  private backgroundMusic = new Audio('assets/sounds/background-music.mp3');
  private bigWinSound = new Audio('assets/sounds/bigwin.mp3');
  private clickSound = new Audio('assets/sounds/click.mp3');
  private freeSpinSound = new Audio('assets/sounds/freespin.mp3');
  private freeSpinTotalSound = new Audio('assets/sounds/freespinwin.wav');
  private megaWinSound = new Audio('assets/sounds/megawin.mp3');
  private epicWinSound = new Audio('assets/sounds/epicwin.wav');
  private scatterSound = new Audio('assets/sounds/scatter.mp3');

  constructor(
    private slotService: SlotService,
    private inventoryService: InventoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    this.initGrid();
    this.spinSound.loop = true;
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;
    this.freeSpinSound.loop = true;
    this.inventoryService.getBalance().subscribe({
      next: (balance: number) => { this.coinBalance = balance; }
    });
  }

  onFreeSpinVideoLoaded(event: Event): void {
    const video = event.target as HTMLVideoElement;
    if (video.currentTime < 0) { video.currentTime = 0; }
  }

  isActiveScatter(row: number, col: number): boolean {
    return this.activeScatterPositions.some(p => p.row === row && p.col === col);
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
    this.backgroundMusic.pause();
    this.freeSpinSound.pause();
  }

  initGrid(): void {
    this.spinningGrid = [];
    for (let row = 0; row < 5; row++) {
      this.spinningGrid.push([
        this.allCardImages[0], this.allCardImages[1],
        this.allCardImages[2], this.allCardImages[3],
        this.allCardImages[4]
      ]);
    }
  }

  isScatterImage(value: string): boolean {
    return typeof value === 'string' && value.includes('scatter');
  }

  isSymbol(value: string): boolean {
    return ['J', 'Q', 'K', 'A', 'WILD', 'SCATTER'].includes(value);
  }

  getSymbolClass(value: string): string { return `symbol-${value}`; }
  getSymbolLetter(value: string): string { return value; }

  getCardDisplay(card: any): string {
    if (card.symbol && card.name !== 'SCATTER') return card.name;
    if (card.symbol && card.name === 'SCATTER') return 'assets/images/scatter.png';
    return card.imageUrl;
  }

  isWinningCell(row: number, col: number): boolean {
    return this.winningPositions.some(pos => pos[0] === row && pos[1] === col);
  }

  isStickyWild(row: number, col: number): boolean {
    return this.stickyWilds.some(w => w.row === row && w.col === col);
  }

  isChainActive(row: number, col: number): boolean {
    const sorted = [...this.winningPositions].sort((a, b) => a[1] - b[1]);
    const idx = sorted.findIndex(p => p[0] === row && p[1] === col);
    return idx !== -1 && idx <= this.chainStep;
  }

  triggerChainLightning(): void {
    if (this.winningPositions.length === 0) return;
    this.chainStep = 0;
    const sorted = [...this.winningPositions].sort((a, b) => a[1] - b[1]);
    const interval = setInterval(() => {
      this.chainStep++;
      this.cdr.detectChanges();
      if (this.chainStep >= sorted.length) {
        clearInterval(interval);
        setTimeout(() => { this.chainStep = -1; this.cdr.detectChanges(); }, 500);
      }
    }, 150);
  }

  triggerScatterAnimation(): Promise<void> {
    return new Promise(resolve => {
      this.scatterSound.currentTime = 0;
      this.scatterSound.play();

      const scatterPositions: {row: number, col: number}[] = [];
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          if (this.spinningGrid[row][col] === 'assets/images/scatter.png') {
            scatterPositions.push({row, col});
          }
        }
      }

      this.activeScatterPositions = scatterPositions;
      this.scatterAnimating = true;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.scatterAnimating = false;
        this.activeScatterPositions = [];
        this.cdr.detectChanges();
        resolve();
      }, 3500);
    });
  }

  getBigWinFontSize(): string {
    const len = this.bigWinAmount.toString().length;
    if (len <= 5) return '7rem';
    if (len <= 7) return '5rem';
    if (len <= 9) return '3.5rem';
    return '2.5rem';
  }

  getFreeSpinTotalFontSize(): string {
    const len = this.freeSpinTotalDisplay.toString().length;
    if (len <= 5) return '7rem';
    if (len <= 7) return '5rem';
    if (len <= 9) return '3.5rem';
    return '2.5rem';
  }

  toggleMusic(): void {
    if (this.musicPlaying) {
      this.backgroundMusic.pause();
      this.musicPlaying = false;
    } else {
      this.backgroundMusic.play();
      this.musicPlaying = true;
    }
    this.cdr.detectChanges();
  }

  toggleFastSpinMenu(): void {
    if (this.fastSpinning) {
      this.fastSpinning = false;
      this.fastSpinCount = 0;
      return;
    }
    this.showFastSpinMenu = !this.showFastSpinMenu;
  }

  selectFastSpin(count: number): void {
    this.fastSpinCount = count;
    this.showFastSpinMenu = false;
    this.fastSpinning = true;
    this.runFastSpin();
  }

  runFastSpin(): void {
    if (this.fastSpinCount <= 0 || !this.fastSpinning) {
      this.fastSpinning = false;
      this.cdr.detectChanges();
      return;
    }
    this.spin();
    const checkDone = setInterval(() => {
      if (!this.isSpinning && !this.showFreeSpinIntro &&
        !this.showBigWin && !this.showMegaWin && !this.showEpicWin &&
        !this.scatterAnimating && !this.showFreeSpinTotal) {
        clearInterval(checkDone);
        this.fastSpinCount--;
        this.cdr.detectChanges();
        if (this.fastSpinCount > 0 && this.fastSpinning) {
          setTimeout(() => { this.runFastSpin(); }, 200);
        } else {
          this.fastSpinning = false;
          this.cdr.detectChanges();
        }
      }
    }, 50);
  }

  manualSpin(): void {
    if (this.fastSpinning) {
      this.fastSpinning = false;
      this.fastSpinCount = 0;
      return;
    }
    this.spin();
  }

  dismissFreeSpinIntro(): void {
    this.showFreeSpinIntro = false;
    this.freeSpinSound.pause();
    this.freeSpinSound.currentTime = 0;
    this.freeSpinSound.loop = true;
    this.freeSpinSound.volume = 0.2;
    this.freeSpinSound.play();
    this.freeSpinsRemaining = this.pendingFreeSpins;
    this.freeSpinTotalWon = 0;
    this.stickyWilds = [];
    this.isFreeSpinMode = true;
    this.cdr.detectChanges();
  }

  dismissFreeSpinTotal(): void {
    this.bigWinSound.pause();
    this.bigWinSound.currentTime = 0;
    this.freeSpinTotalSound.pause();
    this.freeSpinTotalSound.currentTime = 0;
    this.showFreeSpinTotal = false;
    this.freeSpinTotalWon = 0;
    this.cdr.detectChanges();
  }

  spin(): void {
    this.expandingCols = [];
    this.clickSound.currentTime = 0.3;
    this.clickSound.play();
    if (!this.showBigWin) {
      this.bigWinSound.pause();
      this.bigWinSound.currentTime = 0;
    }
    this.showBigWin = false;
    this.bigWinAmount = 0;
    this.chainStep = -1;
    this.isSpinning = true;
    this.message = '';
    this.winningRows = [];
    this.winningPositions = [];
    this.spinResult = null;
    this.spinningCols = [false, false, false, false, false];
    this.stoppingCols = [false, false, false, false, false];
    this.coinWon = 0;

    this.spinSound.currentTime = 0;
    this.spinSound.play();

    const currentBet = this.isFreeSpinMode ? -(this.bet) : this.bet;
    const stickies = this.isFreeSpinMode ? this.stickyWilds : [];

    this.slotService.spin(currentBet, stickies).subscribe({
      next: (result: any) => { this.spinResult = result; },
      error: () => {
        this.isSpinning = false;
        this.message = 'Not enough coins!';
        this.stopAllCols();
        this.spinSound.pause();
        this.fastSpinning = false;
        this.fastSpinCount = 0;
        this.cdr.detectChanges();
      }
    });

    const colDelay = this.fastSpinning ? 100 : 300;
    const spinDuration = this.fastSpinning ? 800 : 2000;

    for (let col = 0; col < 5; col++) {
      setTimeout(() => { this.startCol(col); }, col * colDelay);
    }
    for (let col = 0; col < 5; col++) {
      setTimeout(() => {
        this.stopCol(col);
        this.stopSound.currentTime = 0;
        this.stopSound.play();
      }, col * colDelay + spinDuration);
    }

    setTimeout(() => {
      this.spinSound.pause();
      if (this.spinResult) {
        this.finalizeSpin();
      } else {
        const waitForResult = setInterval(() => {
          if (this.spinResult) {
            clearInterval(waitForResult);
            this.finalizeSpin();
          }
        }, 50);
      }
    }, 5 * colDelay + spinDuration);
  }

  startCol(col: number): void {
    const allSticky = [0, 1, 2, 3, 4].every(row => this.isStickyWild(row, col));
    if (allSticky) return;
    this.spinningCols[col] = true;
    this.cdr.detectChanges();
  }

  stopCol(col: number): void {
    clearInterval(this.colIntervals[col]);
    this.spinningCols[col] = false;
    if (this.spinResult) {
      for (let row = 0; row < 5; row++) {
        if (!this.isStickyWild(row, col)) {
          this.spinningGrid[row][col] = this.getCardDisplay(this.spinResult.grid[row][col]);
        }
      }
    }
    this.lightningCols[col] = true;
    setTimeout(() => { this.lightningCols[col] = false; this.cdr.detectChanges(); }, 400);
    this.cdr.detectChanges();
  }

  stopAllCols(): void {
    for (let col = 0; col < 5; col++) { this.spinningCols[col] = false; }
  }

  getExpandingVideo(col: number): string {
    if (!this.spinResult) return '';
    const videoMap: {[key: string]: string} = {
      'zeus': 'assets/videos/zeus.mp4', 'medusa': 'assets/videos/medusa.mp4',
      'ra': 'assets/videos/ra.mp4', 'anubis': 'assets/videos/anubis.mp4',
      'hydra': 'assets/videos/hydra.mp4', 'cerberus': 'assets/videos/cerberus.mp4',
      'sphinx': 'assets/videos/sphinx.mp4', 'minotaur': 'assets/videos/minotaur.mp4',
      'fenrir': 'assets/videos/fenrir.mp4', 'athena': 'assets/videos/athena.mp4',
      'hermes': 'assets/videos/hermes.mp4', 'osiris': 'assets/videos/osiris.mp4',
      'horus': 'assets/videos/horus.mp4', 'odin': 'assets/videos/odin.mp4',
      'valkyrie': 'assets/videos/valkyrie.mp4'
    };
    const cardNames = this.spinResult.expandingCardNames;
    if (!cardNames) return '';
    const name = cardNames[col] || cardNames[col.toString()] || cardNames[String(col)];
    if (name && videoMap[name]) return videoMap[name];
    return '';
  }

  getExpandingImage(col: number): string {
    if (!this.spinResult) return '';
    for (let row = 0; row < 5; row++) {
      const card = this.spinResult.grid[row][col];
      if (card && !card.symbol) return card.imageUrl;
    }
    return '';
  }

  finalizeSpin(): void {
    if (this.spinResult) {
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          if (!this.isStickyWild(row, col)) {
            this.spinningGrid[row][col] = this.getCardDisplay(this.spinResult.grid[row][col]);
          }
        }
      }
      this.grid = this.spinResult.grid;
      this.coinWon = this.spinResult.coinWon;
      this.winningPositions = this.spinResult.winningPositions || [];
      this.expandingCols = this.spinResult.expandingCols || [];

      if (this.isFreeSpinMode) {
        this.freeSpinTotalWon += this.spinResult.coinWon || 0;
        for (let row = 0; row < 5; row++) {
          for (let col = 0; col < 5; col++) {
            const card = this.spinResult.grid[row][col];
            if (card && card.symbol && card.name === 'WILD') {
              const exists = this.stickyWilds.some(w => w.row === row && w.col === col);
              if (!exists) { this.stickyWilds.push({row, col}); }
            }
          }
        }
      }

      if (this.winningPositions.length > 0) {
        setTimeout(() => { this.triggerChainLightning(); }, 300);
      }

      const newFreeSpins = this.spinResult.freeSpins || 0;
      if (newFreeSpins > 0) {
        this.pendingFreeSpins = (this.freeSpinsRemaining || 0) + newFreeSpins;
        this.triggerScatterAnimation().then(() => {
          this.showFreeSpinIntro = true;
          this.freeSpinSound.pause();
          this.freeSpinSound.currentTime = 0;
          this.freeSpinSound.loop = false;
          this.freeSpinSound.play();
          this.cdr.detectChanges();
        });
        this.cdr.detectChanges();
      }

      const bigWinThreshold = this.bet * 5;
      const megaWinThreshold = this.bet * 20;
      const epicWinThreshold = this.bet * 40;

      if (this.coinWon > 0) {
        if (newFreeSpins === 0) this.message = `Win ${this.coinWon}!`;

        if (this.coinWon >= epicWinThreshold) {
          this.epicWinAmount = 0;
          this.showEpicWin = true;
          this.epicWinSound.currentTime = 0;
          this.epicWinSound.play();
          this.cdr.detectChanges();
          const target = this.coinWon;
          const duration = 2500; const steps = 100;
          const increment = target / steps; let current = 0;
          const counter = setInterval(() => {
            current += increment;
            if (current >= target) { current = target; clearInterval(counter); }
            this.epicWinAmount = Math.round(current);
            this.cdr.detectChanges();
          }, duration / steps);
          setTimeout(() => {
            this.epicWinSound.pause(); this.epicWinSound.currentTime = 0;
            this.showEpicWin = false; this.cdr.detectChanges();
          }, 5000);

        } else if (this.coinWon >= megaWinThreshold) {
          this.megaWinAmount = 0;
          this.showMegaWin = true;
          this.megaWinSound.currentTime = 0;
          this.megaWinSound.play();
          this.cdr.detectChanges();
          const target = this.coinWon;
          const duration = 2200; const steps = 90;
          const increment = target / steps; let current = 0;
          const counter = setInterval(() => {
            current += increment;
            if (current >= target) { current = target; clearInterval(counter); }
            this.megaWinAmount = Math.round(current);
            this.cdr.detectChanges();
          }, duration / steps);
          setTimeout(() => {
            this.megaWinSound.pause(); this.megaWinSound.currentTime = 0;
            this.showMegaWin = false; this.cdr.detectChanges();
          }, 4500);

        } else if (this.coinWon >= bigWinThreshold) {
          this.bigWinAmount = 0;
          this.showBigWin = true;
          this.bigWinSound.currentTime = 0;
          this.bigWinSound.play();
          this.cdr.detectChanges();
          const target = this.coinWon;
          const duration = 2000; const steps = 80;
          const increment = target / steps; let current = 0;
          const counter = setInterval(() => {
            current += increment;
            if (current >= target) { current = target; clearInterval(counter); }
            this.bigWinAmount = Math.round(current);
            this.cdr.detectChanges();
          }, duration / steps);
          setTimeout(() => {
            this.bigWinSound.pause(); this.bigWinSound.currentTime = 0;
            this.showBigWin = false; this.cdr.detectChanges();
          }, 4000);

        } else if (!this.isFreeSpinMode && !this.fastSpinning) {
          setTimeout(() => {
            this.winSound.currentTime = 0;
            this.winSound.play();
            this.cdr.detectChanges();
            setTimeout(() => {
              this.winSound.pause();
              this.winSound.currentTime = 0;
              this.cdr.detectChanges();
            }, 1650);
          }, 500);
        }

        if (!this.fastSpinning && !this.isFreeSpinMode) {
          setTimeout(() => { this.message = ''; this.cdr.detectChanges(); }, 3000);
        }
      } else {
        if (newFreeSpins === 0) this.message = '';
      }

      if (this.isFreeSpinMode && newFreeSpins === 0) {
        this.freeSpinsRemaining--;
        if (this.freeSpinsRemaining <= 0) {
          this.freeSpinsRemaining = 0;
          this.isFreeSpinMode = false;
          this.stickyWilds = [];
          this.freeSpinSound.pause();
          this.freeSpinSound.currentTime = 0;
          this.message = ' Free spins over!';

          if (this.freeSpinTotalWon > 0) {
            setTimeout(() => {
              this.message = '';
              this.showFreeSpinTotal = true;
              this.freeSpinTotalSound.currentTime = 0;
              this.freeSpinTotalSound.play();
              this.freeSpinTotalDisplay = 0;
              this.bigWinSound.currentTime = 0;
              this.bigWinSound.play();
              const target = this.freeSpinTotalWon;
              const duration = 1500; const steps = 60;
              const increment = target / steps; let current = 0;
              const counter = setInterval(() => {
                current += increment;
                if (current >= target) { current = target; clearInterval(counter); }
                this.freeSpinTotalDisplay = Math.round(current);
                this.cdr.detectChanges();
              }, duration / steps);
              this.cdr.detectChanges();
            }, 500);
          } else {
            setTimeout(() => { this.message = ''; this.cdr.detectChanges(); }, 2000);
          }
        }
        this.cdr.detectChanges();
      }
    }

    this.isSpinning = false;
    this.inventoryService.getBalance().subscribe({
      next: (balance: number) => { this.coinBalance = balance; this.cdr.detectChanges(); }
    });
    this.cdr.detectChanges();
  }

  claimDaily(): void {
    this.inventoryService.claimDailyCoins().subscribe({
      next: (user: any) => {
        this.coinBalance = user.coinBalance;
        this.message = 'Daily coins claimed!';
        this.cdr.detectChanges();
      },
      error: () => {
        this.message = 'Already claimed today!';
        this.cdr.detectChanges();
      }
    });
  }
}

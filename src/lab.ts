import { BrokenRadio } from './broken-radio'
import { Color } from "./color/color"
import { Player } from './world/player'
import { Empty, Fire, Ice, Oil, Sand, Smoke, Steam, Stone, Water, Wood } from './element/elements'
import { Coordinate } from './world/world'
import { Common } from './element/elements'

export class CommonLab extends BrokenRadio {
  private pen = Empty

  constructor(container: HTMLElement) {
    super(container, 320, 180, 4)

    let buttonList = document.createElement('div')

    buttonList.appendChild(this.createElementButton('Empty', Empty))
    buttonList.appendChild(this.createElementButton('Sand', Sand))
    buttonList.appendChild(this.createElementButton('Ice', Ice))
    buttonList.appendChild(this.createElementButton('Stone', Stone))
    buttonList.appendChild(this.createElementButton('Wood', Wood))
    buttonList.appendChild(this.createElementButton('Water', Water))
    buttonList.appendChild(this.createElementButton('Oil', Oil))
    buttonList.appendChild(this.createElementButton('Steam', Steam))
    buttonList.appendChild(this.createElementButton('Smoke', Smoke))
    buttonList.appendChild(this.createElementButton('Fire', Fire))

    container.appendChild(buttonList)
  }

  private createElementButton(name: string, ElementClass: any) {
    let button = document.createElement('button')

    button.type = 'button'
    button.textContent = name
    button.onclick = () => { this.pen = ElementClass }

    return button
  }

  protected override _update(): void {
    super._update()

    this.updateMouse(4)
  }

  protected override _paint(): void {
    super._paint()

    this.paintMouse(4, new this.pen().init().baseColor)
  }

  protected paintMouse(radius: number, color: Color) {
    if (this.mouse.check(this.mouse.x, this.mouse.y) == false) {
      return
    }

    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        if (i * i + j * j < radius * radius) {
          this.painter.setPixel(
            this.mouse.x + i,
            this.mouse.y + j,
            color
          )
        }
      }
    }
  }

  protected updateMouse(radius: number) {
    if (this.mouse.pressed) {
      for (let i = -radius; i <= radius; i++) {
        for (let j = -radius; j <= radius; j++) {
          if (i * i + j * j < radius * radius) {
            let c = {
              x: this.mouse.x + i,
              y: this.mouse.y + j
            }

            if (this.world.check(c) && Math.random() > 0.5) {
              this.world.set(c, new this.pen().init())
            }
          }
        }
      }
    }
  }
}

export class PlayerLab extends CommonLab {
  protected player: Player
  protected playerPos: Coordinate
  private nextPlayerMoveAt: number = 0

  constructor(container: HTMLElement) {
    super(container)
    
    this.player = new Player()
    this.playerPos = {x: 0, y: this.world.height - 5}

    for (let i = 0; i < this.player.shape.length; i++) {
      for (let j = 0; j < this.player.shape[0].length; j++) {
        if (this.player.shape[i][j] == null) continue

        let c = {x: this.playerPos.x + j, y: this.playerPos.y + i}
        let e = new Common().init()

        e.color = this.player.shape[i][j]!
        this.world.set(c, e)
      }
    }
  }

  protected _update(): void {
    super._update()

    this.updatePlayer()
  }

  protected updatePlayer() {
    let now = performance.now()
    let isMoving = this.keyboard.up || this.keyboard.down || this.keyboard.left || this.keyboard.right

    if (!isMoving) {
      this.nextPlayerMoveAt = 0
      return
    }

    if (now < this.nextPlayerMoveAt) return
    this.nextPlayerMoveAt = now + 100

    if (this.keyboard.up) {
      if (this.player.moveUp(this.world, this.playerPos)) {
        this.playerPos.y--
      }
    }
    else if (this.keyboard.down) {
      if (this.player.moveDown(this.world, this.playerPos)) {
        this.playerPos.y++
      }
    }

    if (this.keyboard.left) {
      if (this.player.moveLeft(this.world, this.playerPos)) {
        this.playerPos.x--
      }
    }
    else if (this.keyboard.right) {
      if (this.player.moveRight(this.world, this.playerPos)) {
        this.playerPos.x++
      }
    }
  }
}

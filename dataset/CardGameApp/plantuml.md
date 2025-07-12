```plantuml
@startuml

class Game {
  int ID
}

class Player {
  int ID
}

class Deck {
  int ID
}

class Card {
  int ID
  Suit suit
  Compare compare(Card)
}

class Scoreboard {
  int ID
}

class Round {
  int ID
  int points
}

abstract class RoundType {
  int ID
}

class SoloRound {
  SoloType solo
}

class MandatorySolo

class DoubleRound 

enum Suit <<enum>> {
  Diamonds
  Hearts
  Spades
  Clubs
}

enum Compare <<enum>> {
  Lower
  Higher
  Equal
}

enum SoloType <<enum>> {
  Trump
  Jacks
  Queens
}

Game --> "1" Scoreboard
Game --> "1" Deck
Game --> "4" Player

Deck --> "0..48" Card

Scoreboard --> "*" Round

Player --> "1..3" Round
Player --> "1..2" RoundType

RoundType <|-- SoloRound
RoundType <|-- DoubleRound
SoloRound <|-- MandatorySolo

Card --> Suit
Card --> Compare
SoloRound --> SoloType
@enduml
```

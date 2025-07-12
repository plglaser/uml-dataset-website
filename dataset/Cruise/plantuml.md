```plantuml

@startuml
class TravelAgency {
 String Name
 String Address
}

class Ticket {
 Int BookingNumber
 Date BookingDate
}

class Guest {
 String Name
 Boolean VIP
}

class Employee {
 String Name
 Int Ssn
}

class Cruise {
 Int CruiseNumber
 String Name
 Date StartDate
 Date EndDate
}

class ProviderCompany {
 String Name
 String Location
}

class Ship {
 String Name
 Int DeckCount
 Float lenght
 Int PassengerCount
}

class Show {
 String Title
 Int Duration
}

class Destination {
 String Name
 String Sea
}

<> diamond

Cruise "0..*"--"0..1" ProviderCompany
Cruise "0..*"--"0..*" Employee
Cruise "0..*"--"0..1" Ship
TravelAgency "1..1"--"0..*" Ticket
Cruise "0..*"--"0..1" Destination
Cruise "0..*"--"0..*" Show

diamond --"0..1" Guest
diamond --"0..1" Ticket
diamond --"0..1" Cruise

@enduml

```

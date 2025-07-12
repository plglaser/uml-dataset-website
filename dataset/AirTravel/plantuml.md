```plantuml
@startuml

class Airline {
 String Name
}

class Employee {
 String Nmae
 Date StartDate
}

class Airport {
 String Name
 String Address
 Int RunwayCount
}

class FlightAttendant {
 Boolean Purser
}

class Airplane {
 String Name
 String Type
 Date ConstructionYear
 Date NextInspection
}

class Flight {
 String FlightNumber
}

class Pilot {
 String License
}

class PassengerPlane {
 Int Seats
}

class FlightExecution {
 Date Date
}

class SeatCategory {
 String Description
 Boolean Enterainment
 Int SeatCount
}

class Passenger {
 String Name
 String PassportNumber
}

class Ticket {
 String TicketId
 Float Price
 Boolean Upgrade
}



Airline "0..1"-"0..*" Employee
Airline "0..1"o--"0..*" Airplane
Airplane "0..*"-"0..1" Airport
Airplane "0..1"-"0..*" FlightExecution
Airport "0..1"--"0..*" Flight : Source
Airport "0..1"--"0..*" Flight : Destination
Flight "0..1"--"0..*" FlightExecution
FlightExecution "0..*"--"0..*" FlightAttendant
FlightExecution "0..*"-"0..1" Pilot : Captain
FlightExecution "0..*"-"0..2" Pilot : Co-pilot
FlightExecution "0..*"--"0..*" Passenger
Employee <|-- FlightAttendant
Employee <|-- Pilot
Airplane <|-- PassengerPlane
PassengerPlane "0..1"*--"0..*" SeatCategory
SeatCategory "0..1"--"0..*" Ticket
(FlightExecution, Passenger) . Ticket

@enduml
```

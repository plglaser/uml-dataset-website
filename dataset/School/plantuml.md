```plantuml
@startuml

abstract class Person {
    String FirstName
    String LastName
}

class Teacher {
    String Email
}

class Student {}

class ClassGroup {
    String Name
}

class TeacherAssignment {
    Int Hours
}

class School {
    String Name
}

abstract class Room {
    String Name
}

class ClassRoom {
    Int Capacity
}

class OtherRoom {
    Double Size
}

Person <|-- Student
Person <|- Teacher
Teacher "*"-"0..3" School
TeacherAssignment .. (Teacher,School)
Teacher "1"-"0..1" School : Principal
School "1"*-"*" Room
Room <|- OtherRoom
Room <|-- ClassRoom
Student "10..31"-o"1" ClassGroup
ClassGroup "1"-"1" ClassRoom

@enduml
```
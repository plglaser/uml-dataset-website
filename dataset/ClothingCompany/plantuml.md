```plantuml
@startuml

class Order {
    Int OrderNumber
    Int OrderQuantity
    Date OrderDate
    Date DeliveryDate
}

class Category {
    String Name
}

class Product {
    String Name
    String Description
    Double NetPrice
}

class Representative {
    String FirstName
    String LastName
    Int Ssn
    String PhoneNumber
    String Email
}

class Manufacturer {
    String Name
}

class Country {
    String Name
    Double VAT
    String Currency
    Float ConversionRate
}

class Customer {
    String Name
    String Address
    String PhoneNumber
    String Email
}


Product "1"--"*" Order : contains
Category "1"--"*" Product: belongsTo
Representative "1"--"*" Order : placedBy
Manufacturer "*"--"*" Country
Product . (Manufacturer,Country)
Product "*"--"*" Country : soldIn
Representative "*"-"1" Country : responsibleFor
Order "*"-"1" Customer : orders
Country "*"--"*" Customer : resell


@enduml
```
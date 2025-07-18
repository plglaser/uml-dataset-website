```mermaid
classDiagram
    class User {
        String username
        String password
        String email
    }

    class Administrator {
        String idCardNumber
    }

    class WebPortal {
        String versionNumber
        String url
    }

    class Building {
        String id
        String label
        String address
        int yearOfConstruction
    }

    class Entry {
        String name
        boolean public
    }

    class TextEntry {
        String text
    }

    class NumericEntry {
        double value
        String unit
    }

    class EntryGroup

    class EnergyClass {
        <<enum>>
        A
        B
        C
        D
    }

    class Comment {
        String text
    }

    class Image {
        String fileName
    }

    WebPortal "1" --> "*" Entry : id
    WebPortal "0..1" --> "1" User : username
    EntryGroup "1" *-- "*" Entry

    Entry <|-- TextEntry
    Entry <|-- NumericEntry

    User <|-- Administrator

    User "1" --> "*" Building : owner
    User "1" --> "*" Building : author
    Building "1" --> "*" Comment
    Building "1" --> "1" Image : profilePicture
    Building "1" --> "1" EnergyClass
```

const roleColors = {
    'receptionist': '#2ecc71',
    'it_technician': '#e74c3c',
    'security_agent': '#f1c40f',
    'manager': '#9b59b6',
    'cleaning': '#3498db',
    'other': '#95a5a6'
};
const roomCapacity = {
    Reception: 3,
    Server: 2,
    Security: 2,
    Conference: 5,
    Staff: 6,
    Archives: 3
};

const roomDescriptions = {
    Conference: "Meeting room for discussions and presentations.",
    Reception: "Entrance area where visitors are welcomed.",
    Server: "Secured room that holds servers and network equipment.",
    Security: "Room where security monitors cameras and controls access.",
    Staff: "Break room for employees to rest and eat.",
    Archives: "Storage room for important files and documents."
};

const roomAccess = {
    Reception: ['receptionist', 'manager'],
    Server: ['it_technician', 'manager'],
    Security: ['security_agent', 'manager'],
    Conference: ['receptionist', 'it_technician', 'security_agent', 'manager', 'cleaning', 'other'],
    Staff: ['receptionist', 'it_technician', 'security_agent', 'manager', 'cleaning', 'other'],
    Archives: ['manager', 'receptionist', 'it_technician', 'security_agent', 'other']
};
const requiredRooms = ['Reception', 'Server', 'Security', 'Archives'];

let workers = [
    {
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@company.com",
        phone: "+212512345678",
        role: "manager",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        experiences: [
            {
                company: "Tech Corp",
                role: "manager",
                from: "2020-01-15",
                to: "2022-03-20"
            }
        ]
    },
    {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.j@company.com",
        phone: "+212612345679",
        role: "receptionist",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
        experiences: [
            {
                company: "Front Desk Inc",
                role: "receptionist",
                from: "2021-05-10",
                to: "2023-08-15"
            }
        ]
    },
    {
        firstName: "Mike",
        lastName: "Chen",
        email: "mike.chen@company.com",
        phone: "+212712345680",
        role: "it_technician",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        experiences: [
            {
                company: "IT Solutions",
                role: "it_technician",
                from: "2019-08-01",
                to: "2023-11-30"
            }
        ]
    },
    {
        firstName: "Emma",
        lastName: "Davis",
        email: "emma.davis@company.com",
        phone: "+212512345681",
        role: "security_agent",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        experiences: [
            {
                company: "Secure Guard",
                role: "security_agent",
                from: "2022-02-14",
                to: "2024-01-10"
            }
        ]
    },
    {
        firstName: "David",
        lastName: "Wilson",
        email: "david.wilson@company.com",
        phone: "+212612345682",
        role: "cleaning",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        experiences: [
            {
                company: "Clean Pro",
                role: "cleaning",
                from: "2020-11-05",
                to: "2023-12-20"
            }
        ]
    },
    {
        firstName: "Lisa",
        lastName: "Anderson",
        email: "lisa.anderson@company.com",
        phone: "+212512345683",
        role: "receptionist",
        imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        experiences: [
            {
                company: "Welcome Services",
                role: "receptionist",
                from: "2021-03-12",
                to: "2024-02-28"
            }
        ]
    },
    {
        firstName: "James",
        lastName: "Brown",
        email: "james.brown@company.com",
        phone: "+212612345684",
        role: "it_technician",
        imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        experiences: [
            {
                company: "Tech Support",
                role: "it_technician",
                from: "2020-07-20",
                to: "2023-09-15"
            }
        ]
    },
    {
        firstName: "Maria",
        lastName: "Garcia",
        email: "maria.garcia@company.com",
        phone: "+212712345685",
        role: "manager",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
        experiences: [
            {
                company: "Global Management",
                role: "manager",
                from: "2018-04-10",
                to: "2023-06-30"
            }
        ]
    },
    {
        firstName: "Robert",
        lastName: "Taylor",
        email: "robert.taylor@company.com",
        phone: "+212512345686",
        role: "security_agent",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
        experiences: [
            {
                company: "SafeGuard Inc",
                role: "security_agent",
                from: "2021-09-01",
                to: "2024-01-20"
            }
        ]
    },
    {
        firstName: "Anna",
        lastName: "Martinez",
        email: "anna.martinez@company.com",
        phone: "+212612345687",
        role: "cleaning",
        imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face",
        experiences: [
            {
                company: "Sparkle Clean",
                role: "cleaning",
                from: "2022-01-15",
                to: "2024-03-10"
            }
        ]
    },
    {
        firstName: "Kevin",
        lastName: "Lee",
        email: "kevin.lee@company.com",
        phone: "+212712345688",
        role: "it_technician",
        imageUrl: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop&crop=face",
        experiences: [
            {
                company: "Network Systems",
                role: "it_technician",
                from: "2019-11-05",
                to: "2023-10-25"
            }
        ]
    },
    {
        firstName: "Jessica",
        lastName: "White",
        email: "jessica.white@company.com",
        phone: "+212512345689",
        role: "other",
        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        experiences: [
            {
                company: "General Services",
                role: "other",
                from: "2021-06-20",
                to: "2023-12-15"
            }
        ]
    },
    {
        firstName: "Daniel",
        lastName: "Harris",
        email: "daniel.harris@company.com",
        phone: "+212612345690",
        role: "security_agent",
        imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face",
        experiences: [
            {
                company: "Protection Plus",
                role: "security_agent",
                from: "2020-03-18",
                to: "2024-02-05"
            }
        ]
    },
    {
        firstName: "Rachel",
        lastName: "Clark",
        email: "rachel.clark@company.com",
        phone: "+212712345691",
        role: "receptionist",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        experiences: [
            {
                company: "First Impressions",
                role: "receptionist",
                from: "2022-08-10",
                to: "2024-04-01"
            }
        ]
    },
    {
        firstName: "Thomas",
        lastName: "Moore",
        email: "thomas.moore@company.com",
        phone: "+212512345692",
        role: "manager",
        imageUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face",
        experiences: [
            {
                company: "Executive Solutions",
                role: "manager",
                from: "2019-02-14",
                to: "2023-11-20"
            }
        ]
    }
];

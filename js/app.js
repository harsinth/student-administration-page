var app = angular.module("schoolApp", [])
app.controller("registerController", ($scope, $window) => {
  $scope.user = {
    type: "student",
  }

  $scope.register = () => {
    console.log("Registering user:", $scope.user)
    if (!$scope.user.name || !$scope.user.email || !$scope.user.password) {
      $scope.success = false
      $scope.message = "Please fill in all required fields"
      return
    }
    var users = JSON.parse(localStorage.getItem("users") || "[]")
    var emailExists = users.some((user) => user.email === $scope.user.email)

    if (emailExists) {
      $scope.success = false
      $scope.message = "Email already registered"
      return
    }

    $scope.user.id = users.length + 1
    users.push($scope.user)
    localStorage.setItem("users", JSON.stringify(users))

    $scope.success = true
    $scope.message = "Registration successful! You can now login."

    setTimeout(() => {
      $window.location.href = "login.html"
    }, 2000)
  }
})

// Login Controller
app.controller("loginController", ($scope, $window) => {
  $scope.user = {}

  $scope.login = () => {
    console.log("Logging in user:", $scope.user)

    // Validate form
    if (!$scope.user.email || !$scope.user.password) {
      $scope.success = false
      $scope.message = "Please enter email and password"
      return
    }

    // Get users from localStorage
    var users = JSON.parse(localStorage.getItem("users") || "[]")
    var user = users.find((u) => u.email === $scope.user.email && u.password === $scope.user.password)

    if (user) {
      $scope.success = true
      $scope.message = "Login successful!"

      // Store current user in localStorage
      localStorage.setItem("currentUser", JSON.stringify(user))

      // Redirect based on user type
      setTimeout(() => {
        if (user.type === "admin") {
          $window.location.href = "admin/dashboard.html"
        } else if (user.type === "teacher") {
          $window.location.href = "teacher/dashboard.html"
        } else {
          $window.location.href = "student/dashboard.html"
        }
      }, 1000)
    } else {
      $scope.success = false
      $scope.message = "Invalid email or password!"
    }
  }
})

// Admin Dashboard Controller
app.controller("adminController", ($scope) => {
  // Get users from localStorage
  var users = JSON.parse(localStorage.getItem("users") || "[]")

  $scope.stats = {
    students: users.filter((u) => u.type === "student").length,
    teachers: users.filter((u) => u.type === "teacher").length,
  }

  $scope.recentActivities = [
    { description: "New student registered", date: "2025-04-01" },
    { description: "New teacher added", date: "2025-03-30" },
    { description: "System update completed", date: "2025-03-28" },
  ]
})

// Student Management Controller
app.controller("studentManagementController", ($scope) => {
  // Get users from localStorage
  var users = JSON.parse(localStorage.getItem("users") || "[]")

  $scope.students = users.filter((u) => u.type === "student")

  $scope.newStudent = {
    type: "student",
  }

  $scope.addStudent = () => {
    console.log("Adding student:", $scope.newStudent)

    // Add to users array
    var users = JSON.parse(localStorage.getItem("users") || "[]")
    $scope.newStudent.id = users.length + 1
    users.push($scope.newStudent)
    localStorage.setItem("users", JSON.stringify(users))

    // Update students list
    $scope.students = users.filter((u) => u.type === "student")

    // Reset form
    $scope.newStudent = {
      type: "student",
    }
    $scope.showAddForm = false
  }

  $scope.viewStudent = (student) => {
    $scope.selectedStudent = student
  }

  $scope.editStudent = (student) => {
    // In a real app, this would open an edit form
    alert("Edit functionality would be implemented here")
  }

  $scope.deleteStudent = (student) => {
    if (confirm("Are you sure you want to delete this student?")) {
      var users = JSON.parse(localStorage.getItem("users") || "[]")
      users = users.filter((u) => u.id !== student.id)
      localStorage.setItem("users", JSON.stringify(users))

      // Update students list
      $scope.students = users.filter((u) => u.type === "student")
    }
  }
})

// Teacher Management Controller
app.controller("teacherManagementController", ($scope) => {
  // Get users from localStorage
  var users = JSON.parse(localStorage.getItem("users") || "[]")

  $scope.teachers = users.filter((u) => u.type === "teacher")

  $scope.newTeacher = {
    type: "teacher",
  }

  $scope.addTeacher = () => {
    console.log("Adding teacher:", $scope.newTeacher)

    // Add to users array
    var users = JSON.parse(localStorage.getItem("users") || "[]")
    $scope.newTeacher.id = users.length + 1
    users.push($scope.newTeacher)
    localStorage.setItem("users", JSON.stringify(users))

    // Update teachers list
    $scope.teachers = users.filter((u) => u.type === "teacher")

    // Reset form
    $scope.newTeacher = {
      type: "teacher",
    }
    $scope.showAddForm = false
  }

  $scope.viewTeacher = (teacher) => {
    $scope.selectedTeacher = teacher
  }

  $scope.editTeacher = (teacher) => {
    // In a real app, this would open an edit form
    alert("Edit functionality would be implemented here")
  }

  $scope.deleteTeacher = (teacher) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      var users = JSON.parse(localStorage.getItem("users") || "[]")
      users = users.filter((u) => u.id !== teacher.id)
      localStorage.setItem("users", JSON.stringify(users))

      // Update teachers list
      $scope.teachers = users.filter((u) => u.type === "teacher")
    }
  }
})

// Student Dashboard Controller
app.controller("studentDashboardController", ($scope) => {
  // Get current user from localStorage
  var currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
  $scope.student = currentUser

  $scope.events = [
    { name: "Annual Sports Day", date: "2025-05-15" },
    { name: "Science Exhibition", date: "2025-05-20" },
    { name: "Parent-Teacher Meeting", date: "2025-06-05" },
  ]

  $scope.courses = [
    { name: "Mathematics", teacher: "Mr. Johnson", schedule: "Mon, Wed, Fri 9:00 AM" },
    { name: "Science", teacher: "Ms. Smith", schedule: "Tue, Thu 10:30 AM" },
    { name: "English", teacher: "Mrs. Davis", schedule: "Mon, Wed 1:00 PM" },
    { name: "History", teacher: "Mr. Wilson", schedule: "Tue, Fri 2:30 PM" },
  ]
})

// Teacher Dashboard Controller
app.controller("teacherDashboardController", ($scope) => {
  // Get current user from localStorage
  var currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
  $scope.teacher = currentUser

  $scope.events = [
    { name: "Staff Meeting", date: "2025-04-10" },
    { name: "Science Exhibition", date: "2025-05-20" },
    { name: "Parent-Teacher Meeting", date: "2025-06-05" },
  ]

  $scope.classes = [
    { name: "Mathematics 101", grade: "9th", schedule: "Mon, Wed, Fri 9:00 AM", studentCount: 25 },
    { name: "Mathematics 102", grade: "10th", schedule: "Tue, Thu 10:30 AM", studentCount: 22 },
    { name: "Advanced Algebra", grade: "11th", schedule: "Mon, Wed 1:00 PM", studentCount: 18 },
  ]
})

// Student Profile Controller
app.controller("studentProfileController", ($scope, $window) => {
  // Get current user from localStorage
  var currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
  $scope.student = currentUser

  // Initialize passwords object
  $scope.passwords = {
    current: "",
    new: "",
    confirm: "",
  }

  $scope.updateProfile = () => {
    // Validate password change if attempted
    if ($scope.passwords.new) {
      if ($scope.passwords.current !== $scope.student.password) {
        alert("Current password is incorrect")
        return
      }

      if ($scope.passwords.new !== $scope.passwords.confirm) {
        alert("New passwords do not match")
        return
      }

      // Update password
      $scope.student.password = $scope.passwords.new
    }

    // Update user in localStorage
    var users = JSON.parse(localStorage.getItem("users") || "[]")
    var index = users.findIndex((u) => u.id === $scope.student.id)

    if (index !== -1) {
      users[index] = $scope.student
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", JSON.stringify($scope.student))

      alert("Profile updated successfully")
    } else {
      alert("Error updating profile")
    }
  }
})

// Student Courses Controller
app.controller("studentCoursesController", ($scope) => {
  // Get current user from localStorage
  var currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
  $scope.student = currentUser

  // Initialize enrolled courses from localStorage or create default
  var enrolledCoursesData = localStorage.getItem("enrolledCourses_" + $scope.student.id)
  $scope.enrolledCourses = enrolledCoursesData ? JSON.parse(enrolledCoursesData) : []

  // Available courses data
  $scope.availableCourses = [
    {
      id: 1,
      code: "MATH101",
      name: "Introduction to Calculus",
      teacher: "Mr. Johnson",
      subject: "Mathematics",
      schedule: "Mon, Wed, Fri 9:00 AM",
      room: "Room 101",
      credits: 4,
      capacity: 30,
      enrolled: 18,
      description:
        "This course introduces the fundamental concepts of calculus including limits, derivatives, and integrals.",
      syllabus: [
        "Introduction to Limits",
        "Derivatives and Rules",
        "Applications of Derivatives",
        "Integrals and the Fundamental Theorem",
        "Applications of Integration",
      ],
    },
    {
      id: 2,
      code: "PHYS101",
      name: "Physics I: Mechanics",
      teacher: "Dr. Smith",
      subject: "Science",
      schedule: "Tue, Thu 10:30 AM",
      room: "Room 203",
      credits: 4,
      capacity: 25,
      enrolled: 20,
      description:
        "An introduction to classical mechanics, including Newton's laws, conservation of energy and momentum, and rotational motion.",
      syllabus: [
        "Kinematics in One and Two Dimensions",
        "Newton's Laws of Motion",
        "Work and Energy",
        "Conservation of Momentum",
        "Rotational Motion and Angular Momentum",
      ],
    },
    {
      id: 3,
      code: "ENG201",
      name: "Advanced Composition",
      teacher: "Mrs. Davis",
      subject: "English",
      schedule: "Mon, Wed 1:00 PM",
      room: "Room 305",
      credits: 3,
      capacity: 20,
      enrolled: 15,
      description: "This course focuses on developing advanced writing skills for academic and professional contexts.",
      syllabus: [
        "Rhetorical Analysis",
        "Argumentative Writing",
        "Research Methods",
        "Critical Reading",
        "Revision Strategies",
      ],
    },
    {
      id: 4,
      code: "HIST101",
      name: "World History: Ancient Civilizations",
      teacher: "Mr. Wilson",
      subject: "History",
      schedule: "Tue, Fri 2:30 PM",
      room: "Room 402",
      credits: 3,
      capacity: 35,
      enrolled: 28,
      description:
        "A survey of ancient civilizations from Mesopotamia to Rome, examining their cultural, political, and social developments.",
      syllabus: [
        "Mesopotamia and Egypt",
        "Ancient Greece",
        "The Roman Empire",
        "Ancient China and India",
        "The Americas",
      ],
    },
    {
      id: 5,
      code: "CS101",
      name: "Introduction to Programming",
      teacher: "Ms. Chen",
      subject: "Computer Science",
      schedule: "Wed, Fri 11:00 AM",
      room: "Lab 105",
      credits: 4,
      capacity: 25,
      enrolled: 22,
      description:
        "An introduction to programming concepts and problem-solving using a high-level programming language.",
      syllabus: [
        "Basic Programming Concepts",
        "Control Structures",
        "Functions and Methods",
        "Arrays and Lists",
        "Object-Oriented Programming",
      ],
    },
    {
      id: 6,
      code: "BIO101",
      name: "General Biology",
      teacher: "Dr. Martinez",
      subject: "Science",
      schedule: "Mon, Thu 8:30 AM",
      room: "Room 205",
      credits: 4,
      capacity: 30,
      enrolled: 25,
      description:
        "An introduction to the principles of biology, including cell structure, genetics, evolution, and ecology.",
      syllabus: [
        "Cell Structure and Function",
        "Genetics and Inheritance",
        "Evolution and Natural Selection",
        "Ecology and Ecosystems",
        "Diversity of Life",
      ],
    },
  ]

  // Check if a course is already enrolled
  $scope.isEnrolled = (course) => $scope.enrolledCourses.some((c) => c.id === course.id)

  // Enroll in a course
  $scope.enrollCourse = (course) => {
    if (!$scope.isEnrolled(course)) {
      $scope.enrolledCourses.push(course)
      localStorage.setItem("enrolledCourses_" + $scope.student.id, JSON.stringify($scope.enrolledCourses))
      alert("Successfully enrolled in " + course.name)
    }
  }

  // Unenroll from a course
  $scope.unenrollCourse = (course) => {
    if (confirm("Are you sure you want to unenroll from " + course.name + "?")) {
      $scope.enrolledCourses = $scope.enrolledCourses.filter((c) => c.id !== course.id)
      localStorage.setItem("enrolledCourses_" + $scope.student.id, JSON.stringify($scope.enrolledCourses))
    }
  }

  // View course details
  $scope.viewCourseDetails = (course) => {
    $scope.selectedCourse = course
  }
})

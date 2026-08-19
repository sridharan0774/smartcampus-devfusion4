import { PrismaClient, Role, AttendanceStatus, SubmissionStatus, EventStatus, PlacementStatus, ApplicationStatus, Priority, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SmartCampus PostgreSQL Database Seeding...');

  // Clear existing data in reverse order of dependencies
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.clubMembership.deleteMany();
  await prisma.club.deleteMany();
  await prisma.application.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.eventSpeaker.deleteMany();
  await prisma.event.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignmentAttachment.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.attendanceSession.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.course.deleteMany();
  await prisma.department.deleteMany();
  await prisma.session.deleteMany();
  await prisma.emailVerificationToken.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();

  const commonPasswordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create Departments
  const cseDept = await prisma.department.create({
    data: {
      code: 'CSE',
      name: 'Computer Science & Engineering',
      description: 'Department of Computer Science, AI, and Software Engineering.',
    },
  });

  const eceDept = await prisma.department.create({
    data: {
      code: 'ECE',
      name: 'Electronics & Communication',
      description: 'Department of Microelectronics, Embedded Systems, and Communication.',
    },
  });

  const meDept = await prisma.department.create({
    data: {
      code: 'ME',
      name: 'Mechanical Engineering',
      description: 'Department of Robotics, Thermal, and Industrial Design.',
    },
  });

  console.log('✅ Departments created');

  // 2. Create Courses
  const btechCse = await prisma.course.create({
    data: {
      code: 'BTECH-CSE',
      title: 'B.Tech Computer Science & Engineering',
      credits: 160,
      semester: 6,
      departmentId: cseDept.id,
    },
  });

  const btechEce = await prisma.course.create({
    data: {
      code: 'BTECH-ECE',
      title: 'B.Tech Electronics & Communication',
      credits: 155,
      semester: 6,
      departmentId: eceDept.id,
    },
  });

  console.log('✅ Courses created');

  // 3. Create Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@smartcampus.demo',
      passwordHash: commonPasswordHash,
      name: 'Dr. Arthur Pendelton (Admin)',
      role: Role.ADMIN,
      isVerified: true,
      departmentId: cseDept.id,
      phone: '+1 555-0199',
      bio: 'Head of Campus IT & Administration.',
    },
  });

  // 4. Create Coordinator
  const coordinatorUser = await prisma.user.create({
    data: {
      email: 'coordinator@smartcampus.demo',
      passwordHash: commonPasswordHash,
      name: 'Prof. Sarah Jenkins (Coordinator)',
      role: Role.COORDINATOR,
      isVerified: true,
      departmentId: cseDept.id,
      phone: '+1 555-0188',
      bio: 'Campus Events & Student Affairs Lead Coordinator.',
    },
  });

  // 5. Create 5 Faculty
  const facultyMain = await prisma.user.create({
    data: {
      email: 'faculty@smartcampus.demo',
      passwordHash: commonPasswordHash,
      name: 'Dr. Robert Vance (Faculty)',
      role: Role.FACULTY,
      isVerified: true,
      departmentId: cseDept.id,
      phone: '+1 555-0177',
      bio: 'Associate Professor of Computer Science & Web Engineering.',
    },
  });

  const faculty2 = await prisma.user.create({
    data: {
      email: 'faculty.alicia@smartcampus.demo',
      passwordHash: commonPasswordHash,
      name: 'Dr. Alicia Martinez',
      role: Role.FACULTY,
      isVerified: true,
      departmentId: cseDept.id,
      phone: '+1 555-0176',
      bio: 'Professor of Artificial Intelligence & Machine Learning.',
    },
  });

  const faculty3 = await prisma.user.create({
    data: {
      email: 'faculty.chen@smartcampus.demo',
      passwordHash: commonPasswordHash,
      name: 'Dr. David Chen',
      role: Role.FACULTY,
      isVerified: true,
      departmentId: eceDept.id,
      phone: '+1 555-0175',
      bio: 'Professor of Embedded Systems & VLSI.',
    },
  });

  const faculty4 = await prisma.user.create({
    data: {
      email: 'faculty.taylor@smartcampus.demo',
      passwordHash: commonPasswordHash,
      name: 'Prof. Emily Taylor',
      role: Role.FACULTY,
      isVerified: true,
      departmentId: cseDept.id,
      phone: '+1 555-0174',
    },
  });

  const faculty5 = await prisma.user.create({
    data: {
      email: 'faculty.kumar@smartcampus.demo',
      passwordHash: commonPasswordHash,
      name: 'Dr. Suresh Kumar',
      role: Role.FACULTY,
      isVerified: true,
      departmentId: meDept.id,
      phone: '+1 555-0173',
    },
  });

  console.log('✅ Faculty created');

  // 6. Create 20 Students
  const primaryStudent = await prisma.user.create({
    data: {
      email: 'student@smartcampus.demo',
      passwordHash: commonPasswordHash,
      name: 'Alex Rivera (Demo Student)',
      role: Role.STUDENT,
      isVerified: true,
      departmentId: cseDept.id,
      rollNumber: 'CS2024-001',
      semester: 6,
      phone: '+1 555-0101',
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      linkedinUrl: 'https://linkedin.com/in/alex-rivera-demo',
      githubUrl: 'https://github.com/alexrivera-demo',
      bio: 'Full Stack Engineering student passionate about open source and cloud computing.',
    },
  });

  const students = [primaryStudent];

  for (let i = 2; i <= 20; i++) {
    const padded = i.toString().padStart(3, '0');
    const st = await prisma.user.create({
      data: {
        email: `student${i}@smartcampus.demo`,
        passwordHash: commonPasswordHash,
        name: `Student User ${i}`,
        role: Role.STUDENT,
        isVerified: true,
        departmentId: i % 2 === 0 ? cseDept.id : eceDept.id,
        rollNumber: `CS2024-${padded}`,
        semester: 6,
        phone: `+1 555-01${padded}`,
        skills: ['Python', 'Java', 'SQL'],
        bio: `Computer Science student cohort 2024 #${i}.`,
      },
    });
    students.push(st);
  }

  console.log('✅ 20 Students created');

  // 7. Create Subjects
  const dsSubject = await prisma.subject.create({
    data: {
      code: 'CS301',
      name: 'Data Structures & Algorithms',
      courseId: btechCse.id,
      facultyId: facultyMain.id,
    },
  });

  const webSubject = await prisma.subject.create({
    data: {
      code: 'CS302',
      name: 'Full Stack Web Development',
      courseId: btechCse.id,
      facultyId: facultyMain.id,
    },
  });

  const aiSubject = await prisma.subject.create({
    data: {
      code: 'CS303',
      name: 'Artificial Intelligence & Neural Networks',
      courseId: btechCse.id,
      facultyId: faculty2.id,
    },
  });

  const embeddedSubject = await prisma.subject.create({
    data: {
      code: 'EC301',
      name: 'Embedded Microcontrollers',
      courseId: btechEce.id,
      facultyId: faculty3.id,
    },
  });

  console.log('✅ Subjects created');

  // 8. Attendance Sessions & Records
  for (let i = 1; i <= 10; i++) {
    const sessionDate = new Date();
    sessionDate.setDate(sessionDate.getDate() - i);

    const session = await prisma.attendanceSession.create({
      data: {
        subjectId: webSubject.id,
        facultyId: facultyMain.id,
        date: sessionDate,
        qrCodeToken: `QR-SESS-WEBDEV-${i}-${Date.now()}`,
      },
    });

    for (const st of students) {
      // Primary student gets 90% attendance, others vary
      const isPresent = st.id === primaryStudent.id ? i !== 3 : (i + st.rollNumber!.charCodeAt(7)) % 5 !== 0;
      await prisma.attendance.create({
        data: {
          sessionId: session.id,
          studentId: st.id,
          status: isPresent ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT,
          remarks: isPresent ? 'Attended lecture on time' : 'Absent without prior permission',
        },
      });
    }
  }

  console.log('✅ Attendance Sessions & Records created');

  // 9. Assignments & Submissions
  const assign1 = await prisma.assignment.create({
    data: {
      title: 'Assignment 1: Build a Scalable REST API with Express & TypeScript',
      description: 'Implement complete JWT authentication, input validation using Zod, and PostgreSQL schema migrations.',
      subjectId: webSubject.id,
      facultyId: facultyMain.id,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      maxMarks: 100,
      rubric: 'Architecture: 30%, Code Quality: 30%, Tests: 20%, Documentation: 20%',
      isPublished: true,
      attachments: {
        create: [
          {
            fileName: 'Assignment_1_Instructions.pdf',
            fileUrl: 'https://smartcampus.demo/uploads/Assignment_1_Instructions.pdf',
          },
        ],
      },
    },
  });

  const assign2 = await prisma.assignment.create({
    data: {
      title: 'Assignment 2: Graph Traversal & Dynamic Programming Solutions',
      description: 'Solve 5 algorithmic challenges in Java/Python and submit comprehensive complexity analysis.',
      subjectId: dsSubject.id,
      facultyId: facultyMain.id,
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (completed)
      maxMarks: 100,
      rubric: 'Correctness: 50%, Time Complexity: 30%, Documentation: 20%',
      isPublished: true,
    },
  });

  // Submissions for assignment 2
  await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assign2.id,
      studentId: primaryStudent.id,
      githubUrl: 'https://github.com/alexrivera-demo/ds-assignment-2',
      fileUrl: 'https://smartcampus.demo/uploads/Alex_Rivera_DS_Assignment2.pdf',
      fileName: 'Alex_Rivera_DS_Assignment2.pdf',
      status: SubmissionStatus.GRADED,
      marks: 95,
      feedback: 'Excellent dynamic programming analysis and clean implementation!',
      gradedAt: new Date(),
    },
  });

  console.log('✅ Assignments & Submissions created');

  // 10. Events & Registrations
  const hackathonEvent = await prisma.event.create({
    data: {
      title: 'DevFusion 4.O National Hackathon 2026',
      description: 'Annual 36-hour developer hackathon bringing together top engineering talent to solve real-world problems.',
      venue: 'Main Campus Auditorium & Innovation Hub',
      bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
      registrationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      maxSeats: 150,
      availableSeats: 148,
      status: EventStatus.UPCOMING,
      organizerId: coordinatorUser.id,
      speakers: {
        create: [
          {
            name: 'Dr. Elena Rostova',
            title: 'VP of AI Research at CloudTech',
            bio: 'Keynote on Generative AI & Autonomous Agent Systems.',
          },
          {
            name: 'Marcus Vance',
            title: 'Lead Architect at DevOps Solutions',
            bio: 'Workshop on Microservices & Kubernetes.',
          },
        ],
      },
    },
  });

  // Register primary student for hackathon
  await prisma.eventRegistration.create({
    data: {
      eventId: hackathonEvent.id,
      studentId: primaryStudent.id,
      qrCodePass: `DEVFUSION-PASS-ALEX-RIVERA-${Date.now()}`,
    },
  });

  console.log('✅ Events & Registrations created');

  // 11. Placements & Applications
  const placement1 = await prisma.placement.create({
    data: {
      companyName: 'Google Cloud Platform',
      companyLogo: 'https://www.google.com/favicon.ico',
      jobRole: 'Software Engineer - Cloud Infrastructure',
      description: 'Develop highly scalable distributed systems and backend cloud APIs.',
      eligibility: 'CGPA >= 8.0, B.Tech CSE/ECE, No active backlogs',
      ctc: '$120,000 / annum (32 LPA)',
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: PlacementStatus.OPEN,
    },
  });

  const placement2 = await prisma.placement.create({
    data: {
      companyName: 'Microsoft Tech',
      companyLogo: 'https://www.microsoft.com/favicon.ico',
      jobRole: 'Full Stack Engineer',
      description: 'Build web applications using React, TypeScript, and Azure Cloud Services.',
      eligibility: 'CGPA >= 7.5, B.Tech CSE/ECE',
      ctc: '$110,000 / annum (28 LPA)',
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: PlacementStatus.OPEN,
    },
  });

  // Apply primary student to Google placement
  await prisma.application.create({
    data: {
      placementId: placement1.id,
      studentId: primaryStudent.id,
      resumeUrl: 'https://smartcampus.demo/uploads/Alex_Rivera_Resume_2026.pdf',
      status: ApplicationStatus.SHORTLISTED,
    },
  });

  console.log('✅ Placements & Applications created');

  // 12. Clubs & Memberships
  const codingClub = await prisma.club.create({
    data: {
      name: 'SmartCampus Developers Guild',
      description: 'Official student developer community focusing on Web3, AI, Cloud, and Competitive Programming.',
      category: 'Technical',
      logoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80',
      coordinatorId: coordinatorUser.id,
    },
  });

  const roboticsClub = await prisma.club.create({
    data: {
      name: 'Robotics & Automation Society',
      description: 'Hands-on robotics hardware building, drone design, and autonomous rover competitions.',
      category: 'Robotics',
      coordinatorId: coordinatorUser.id,
    },
  });

  await prisma.clubMembership.create({
    data: {
      clubId: codingClub.id,
      studentId: primaryStudent.id,
      status: 'APPROVED',
    },
  });

  console.log('✅ Clubs & Memberships created');

  // 13. Announcements
  await prisma.announcement.create({
    data: {
      title: 'Welcome to DevFusion 4.O SmartCampus Platform!',
      content: 'We are thrilled to launch the new Smart Campus Management Platform. All students and faculty can access their dashboards, view attendance, submit assignments, and track placement drives.',
      priority: Priority.HIGH,
      authorId: adminUser.id,
      publishDate: new Date(),
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'DevFusion 4.O Hackathon Registration Is Now Live',
      content: 'Register your teams before the deadline. Winners will receive exciting prizes and direct interview opportunities with lead placement sponsors.',
      priority: Priority.URGENT,
      authorId: coordinatorUser.id,
      publishDate: new Date(),
    },
  });

  console.log('✅ Announcements created');

  // 14. Notifications & Audit Logs
  await prisma.notification.create({
    data: {
      userId: primaryStudent.id,
      type: NotificationType.ASSIGNMENT_GRADED,
      title: 'Assignment Graded!',
      message: 'Your submission for Assignment 2 (Data Structures) was graded 95/100 by Dr. Robert Vance.',
      isRead: false,
      link: '/assignments',
    },
  });

  await prisma.notification.create({
    data: {
      userId: primaryStudent.id,
      type: NotificationType.APPLICATION_STATUS,
      title: 'Placement Status Updated',
      message: 'You have been SHORTLISTED for Google Cloud Platform - Software Engineer role!',
      isRead: false,
      link: '/placements',
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: adminUser.id,
      action: 'SYSTEM_SEED',
      resource: 'Database',
      details: 'Populated initial system seed data for DevFusion 4.O demonstration.',
      ipAddress: '127.0.0.1',
    },
  });

  // 15. Settings
  await prisma.setting.createMany({
    data: [
      { key: 'institution_name', value: 'DevFusion Institute of Technology' },
      { key: 'academic_year', value: '2025-2026' },
      { key: 'attendance_threshold', value: '75' },
      { key: 'allow_registration', value: 'true' },
    ],
  });

  console.log('🎉 SmartCampus Seed Data successfully completed!');
  console.log('----------------------------------------------------');
  console.log('🔑 DEMO CREDENTIALS (Password for all: Password123!):');
  console.log('  Admin:       admin@smartcampus.demo');
  console.log('  Coordinator: coordinator@smartcampus.demo');
  console.log('  Faculty:     faculty@smartcampus.demo');
  console.log('  Student:     student@smartcampus.demo');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

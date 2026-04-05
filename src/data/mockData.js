export const ADMIN_SECURITY_PROMPT = 'Admin contact (email/phone for OTP)'

export const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const initialEvents = [
  {
    id: createId(),
    title: 'Stress-Free Study Workshop',
    date: '2026-04-05',
    time: '10:30 AM',
    venue: 'Campus Wellness Hall',
    seats: 25,
  },
  {
    id: createId(),
    title: 'Morning Yoga for Beginners',
    date: '2026-04-07',
    time: '07:00 AM',
    venue: 'Sports Complex Studio 2',
    seats: 18,
  },
  {
    id: createId(),
    title: 'Smart Nutrition on Budget',
    date: '2026-04-09',
    time: '04:00 PM',
    venue: 'Student Activity Center',
    seats: 30,
  },
]

export const initialFeedbacks = [
  {
    id: createId(),
    studentId: '1001',
    message: 'It would help to have evening meditation sessions before exams.',
    createdAt: '2026-03-29',
    reply: 'Great suggestion. We are adding a pilot evening slot next week.',
  },
]

export const initialSessions = [
  {
    id: createId(),
    studentId: '1002',
    date: '2026-04-03',
    concern: 'Feeling overwhelmed managing classes and part-time work.',
    status: 'pending',
    responseMessage: '',
  },
]

export const initialCounselors = [
  {
    id: createId(),
    name: 'Dr. Maya Iyer',
    specialization: 'Academic Stress & Anxiety',
    availability: 'Mon-Fri, 9:00 AM - 3:00 PM',
  },
  {
    id: createId(),
    name: 'Coach Rohan Malik',
    specialization: 'Fitness & Lifestyle Balance',
    availability: 'Tue-Thu, 11:00 AM - 6:00 PM',
  },
]

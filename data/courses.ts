interface MembershipPlan {
    id: string;       // e.g. "PAYG"
    label: string;    // e.g. "Pay As You Go"
  }
  
  interface CourseSchedule {
    startDate: string;
    endDate: string;
    day: string;
    timeScheduleForADay: Array<{
        startTime: string;
        endTime: string;
        locationId: string;
        trainerIds: string[];
      }>;
    capacity: number;
    scheduleName: string;
  }
  
  interface CourseDetails {
    name: string;
    description: string;
    image: string;
    facilityIds: string[];             // select in admin panel (references a facility DB entry)
    trainerIds: string[];              // select in admin panel (references a trainer DB entry)
    taxIds: string[];                  // select in admin panel (references a tax DB entry)
    useSinglePrice: boolean;           // switch in admin panel
    eligibility: Array<{
      planId: string;               // references MembershipPlan.id
      isEligible: boolean;          // switch in admin panel
      price?: string;                // displayed if isEligible is true
    }>;
    private: boolean;               // switch in admin panel
  }
  
  interface Course {
    id: string;
    details: CourseDetails;
    schedule: CourseSchedule[];
  }




  export const courses: Course[] = [
    {
      id: "1",
      details: {
        name: "All Hs Girls (Gr. 10-12s) Spring Club Tryouts // March 10th, 2025",
        description: "March 10th, 2025  6PM - 8M  Non-refundable",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "25$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "0$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "25$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "0$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "25$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2025-03-10",
        endDate: "2025-03-10",
        day: "Monday",
        timeScheduleForADay: [
          {
            startTime: "18:00",
            endTime: "20:00",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 300,
        scheduleName: "U16 Girls Spring Club Tryouts",
      },
      ],
    },

    {
      id: "2",
      details: {
        name: "APRIL Spring Break Camp",
        description: "Join us for skills, drills and fun on the Court! DATES: April 22, 23, 24, 25TIMES: 10AM-3:30PMPlease bring indoor shoes, a ball, water bottles, Lunch and Snacks",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "GST(5%)",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "252$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "226.8$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: true, price: "252$" },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "252$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: true, price: "252$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "226.8$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "252$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2025-04-22",
        endDate: "2025-04-22",
        day: "Tuesday",
        timeScheduleForADay: [
          {
            startTime: "10:00",
            endTime: "15:30",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 300,
        scheduleName: "Spring Break Camp",
      },
      ],
    },

    {
      id: "3",
      details: {
        name: "BOYS  U12/U13 Spring Club Tryouts",
        description: "JANUARY 10, 2025 8:00 - 9:45PM Court 1, 2 and 3 AND JANUARY 12, 2025 11:00 - 12:45PM Court 1, 2 and 3 Address: Rise Facility Non-refundable",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
          "Check_out_Tryout_locatiions_via_website",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "25$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "0$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "25$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "0$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "25$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2025-01-10",
        endDate: "2025-01-10",
        day: "Friday",
        timeScheduleForADay: [
          {
            startTime: "20:00",
            endTime: "21:45",
            locationId: "Check_out_Tryout_locatiions_via_website",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 500,
        scheduleName: "Boys U13 Spring Club Tryouts JAN 9 & JAN 10",
      },
      ],
    },

    {
      id: "4",
      details: {
        name: "BOYS U11 Spring Club Tryouts",
        description: "January 09, 2025 6:00PM - 8:15PM Court 1 and 2 January 10, 2025 6:00 - 7:30 PM Court 2 Address: Rise Facility Non-refundable",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
          "Check_out_Tryout_locatiions_via_website",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "25$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "0$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "25$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "0$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "25$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2025-01-09",
        endDate: "2025-01-09",
        day: "Thursday",
        timeScheduleForADay: [
          {
            startTime: "18:00",
            endTime: "20:15",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 500,
        scheduleName: "Boys U11 Spring Club Tryouts For everyone",
      },
      ],
    },

    {
      id: "5",
      details: {
        name: "BOYS U14/U15 Spring Club Tryouts",
        description: "January 12, 2025 7:15 - 9:30PM Court 1, 2 and 3 January 13, 2025  8:00 - 9:45PM Court 1, 2 and 3 Address: Rise Facility Non-refundable",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "25$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "0$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "25$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "0$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "25$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2025-01-12",
        endDate: "2025-01-12",
        day: "Sunday",
        timeScheduleForADay: [
          {
            startTime: "19:15",
            endTime: "21:30",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 483,
        scheduleName: "Boys U15 Spring Club Tryouts For everyone",
      },
      ],
    },

    {
      id: "6",
      details: {
        name: "Drop In",
        description: "Drop in access to Rise 3 courts",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "GST(5%)",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "15$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "0$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: true, price: "0$" },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "15$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "0$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "15$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2024-11-29",
        endDate: "2024-11-29",
        day: "Friday",
        timeScheduleForADay: [
          {
            startTime: "8:30",
            endTime: "18:00",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          },
          {
            startTime: "22:00",
            endTime: "23:00",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          },
          
        ],
        capacity: 100,
        scheduleName: "Rise Court 1 and 2",
      },
      {
        startDate: "2024-11-29",
        endDate: "2024-11-29",
        day: "Friday",
        timeScheduleForADay: [
          {
            startTime: "8:30",
            endTime: "18:00",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          },
          {
            startTime: "20:00",
            endTime: "21:00",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          },
          
        ],
        capacity: 100,
        scheduleName: "Rise Court 3",
      },
      {
        startDate: "2024-11-30",
        endDate: "2024-11-30",
        day: "Saturday",
        timeScheduleForADay: [
          {
            startTime: "13:30",
            endTime: "18:30",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          },
          {
            startTime: "19:30",
            endTime: "23:00",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          },
          
        ],
        capacity: 100,
        scheduleName: "Rise Court 1",
      },
      ],
    },

    {
      id: "7",
      details: {
        name: "GIRLS U11 Spring Club Tryouts",
        description: "January 10, 2025 6:00PM - 7:30PM Address: Rise Facility Court 1 Non-refundable",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "25$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "0$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "25$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "0$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "25$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2025-01-10",
        endDate: "2025-01-10",
        day: "Friday",
        timeScheduleForADay: [
          {
            startTime: "18:00",
            endTime: "19:30",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 100,
        scheduleName: "GIRLS U11 Spring Club Tryouts",
      },
      ],
    },

    {
      id: "8",
      details: {
        name: "GIRLS U12/U13 Spring Club Tryouts",
        description: "January 10, 2025 5:30PM - 7:30PM Court 3 & Surge Court January 12, 2025 1:00 - 2:30PM Court 1&2 Non-refundable Address: Rise Facility",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "25$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "0$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "25$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "0$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "25$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2025-01-10",
        endDate: "2025-01-10",
        day: "Friday",
        timeScheduleForADay: [
          {
            startTime: "17:30",
            endTime: "19:30",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 500,
        scheduleName: "Girls U13 Spring Club Tryouts For everyone",
      },
      ],
    },

    {
      id: "9",
      details: {
        name: "GIRLS U14/U15 Spring Club Tryouts",
        description: "January 12, 2025 5:00 -7:00PM Court 1, 2 and 3 January 13, 2025 5:30 - 7:30PM Court 1, 2 and 3 Address: Rise Facility",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "25$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "0$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "25$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "0$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "25$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2025-01-12",
        endDate: "2025-01-12",
        day: "Sunday",
        timeScheduleForADay: [
          {
            startTime: "17:00",
            endTime: "19:00",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 500,
        scheduleName: "Girls U15 Spring Club Tryouts For everyone",
      },
      ],
    },

    {
      id: "10",
      details: {
        name: "Holiday Hoops Academy (Winter Camp 2024) Ages 9-17",
        description: "Join us for 4 days filled with Skills, Games, Fundamentals and Competitive drills all with a holiday twist! DEC 21 1PM-7PM DEC 22 130PM-730PM DEC 23 9AM-4PM",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
          "Check out Tryout location via website"
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "GST(5%)",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "275$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "89$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "275$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "89$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "275$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2024-12-21",
        endDate: "2024-12-23",
        day: "Saturday",
        timeScheduleForADay: [
          {
            startTime: "13:00",
            endTime: "19:00",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 300,
        scheduleName: "Holiday Hoops Academy (Winter Camp 2024) Ages 11-17 For everyone",
      },
      ],
    },

    {
      id: "11",
      details: {
        name: "MARCH Spring Break Camp",
        description: "Join us for skills, drills and fun on the court. DATES: March 24, 25, 26, 27, 28 TIME: 10AM-3:30PM Please bring indoor shoes, a ball, water bottles, Lunch and Snacks",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "GST(5%)",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "315$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "283.5$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: true, price: "315$" },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "315$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: true, price: "315$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "283.5$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "315$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2025-03-24",
        endDate: "2025-03-24",
        day: "Monday",
        timeScheduleForADay: [
          {
            startTime: "10:00",
            endTime: "15:30",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 300,
        scheduleName: "Spring Break Camp",
      },
      ],
    },

    {
      id: "12",
      details: {
        name: "Pro Rise Club",
        description: "WARNING ** SERIOUS ATHLETES ONLY** 4x per week Strength & Conditioning to get you prepared and stronger. Designed to build endurance and resilience for the season ahead. $650+gst for non-members",
        image: "",
        facilityIds: [
          "Check out Tryout location via website"
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "GST(5%)",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "650$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "89$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "89$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "89$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "650$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2024-12-16",
        endDate: "2024-12-16",
        day: "Monday",
        timeScheduleForADay: [
          {
            startTime: "17:30",
            endTime: "18:30",
            locationId: "Check out Tryout location via website",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 400,
        scheduleName: "Pro Rise Club For everyone",
      },
      ],
    },

    {
      id: "13",
      details: {
        name: "Rise & Honor Memorial Cup",
        description: "Available Age Groups: U11 Boys & Girls U13 Boys & Girls U15 Boys & Girls U17 Boys & Girls U18 Boys & Girls",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "GST(5%)",
          "Processing Fee(3.9)"
        ],
        useSinglePrice: true,
        eligibility: [
          { planId: "Drop in Clients", isEligible: true, price: "650$" },
          { planId: "Clients", isEligible: true, price: "650$" },
          // ...repeat for each membership plan
        ],
        private: true,
      },
      schedule: [
        {
        startDate: "2025-05-30",
        endDate: "2025-06-01",
        day: "Friday",
        timeScheduleForADay: [
          {
            startTime: "10:00",
            endTime: "20:00",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 100,
        scheduleName: "Rise & Honor Memorial Cup",
      },
      ],
    },

    {
      id: "14",
      details: {
        name: "Rising Stars Camp (Winter Camp 2024) Ages 10-13",
        description: "Join us for 3 days filled with Skills, Games, Fundamentals and Competitive drills all with a holiday twist! DEC 20 6PM-8PM, DEC 21 9AM-12PM, DEC 22 10AM-1PM",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "GST(5%)",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "199$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "50$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: true, price: "50$" },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "199$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "50$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "199$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: true,
      },
      schedule: [
        {
        startDate: "2024-12-20",
        endDate: "2024-12-22",
        day: "Friday",
        timeScheduleForADay: [
          {
            startTime: "18:00",
            endTime: "21:00",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 300,
        scheduleName: "Rising Stars Camp (Winter Camp 2024) Ages 5-10 For everyone",
      },
      ],
    },

    {
      id: "15",
      details: {
        name: "U11 CO-ED Winter League Assessments (Tier 3)",
        description: "January 17, 2025 6:00-7:45PM Court 1 and 2 Address: Rise Facility Non-Refundable",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "25$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "0$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "25$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "0$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "25$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2025-01-17",
        endDate: "2025-01-17",
        day: "Friday",
        timeScheduleForADay: [
          {
            startTime: "18:00",
            endTime: "19:45",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 500,
        scheduleName: "Co-Ed U11 Winter League Assessments (Tier 3)",
      },
      ],
    },

    {
      id: "16",
      details: {
        name: "U13 BOYS  Winter Rise League Assessments (Tier 3)",
        description: "January 17, 2025 8:00 -9:30 PM Court 1 and 2 Address: Rise Facility Non-Refundable",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "25$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "0$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "25$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "0$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "25$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2025-01-17",
        endDate: "2025-01-17",
        day: "Friday",
        timeScheduleForADay: [
          {
            startTime: "20:00",
            endTime: "21:30",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 500,
        scheduleName: "Boys U13 Winter Rise League Assessments (Tier 3)",
      },
      ],
    },

    {
      id: "17",
      details: {
        name: "U13/U15 GIRLS Winter Rise League Assessments (Tier 3)",
        description: "January 19, 2025 12:30 - 2:30PM Court 1, 2 and 3 Address: Rise Facility Non-Refundable",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "25$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "0$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "25$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "0$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "25$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2025-01-19",
        endDate: "2025-01-19",
        day: "Sunday",
        timeScheduleForADay: [
          {
            startTime: "12:30",
            endTime: "14:30",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 500,
        scheduleName: "Girls U13/U15 Winter Rise League Assessments (Tier 3)",
      },
      ],
    },

    {
      id: "18",
      details: {
        name: "U15 BOYS Winter League Assessments (Tier 3)",
        description: "January 19, 2025 10:00 - 12;00PM Court 1, 2 and 3 Address: Rise Facility Non-Refundable",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "25$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "0$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "25$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "0$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "25$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2025-01-19",
        endDate: "2025-01-19",
        day: "Sunday",
        timeScheduleForADay: [
          {
            startTime: "10:00",
            endTime: "12:00",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 500,
        scheduleName: "Boys U15 Winter League Assessments (Tier 3)",
      },
      ],
    },

    {
      id: "19",
      details: {
        name: "U16 Boys (Gr. 10)  Spring Club Tryouts // March 10th, 2025",
        description: "March 10th, 2025 8PM - 10M",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "25$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "0$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "25$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "0$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "25$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2025-03-10",
        endDate: "2025-03-10",
        day: "Monday",
        timeScheduleForADay: [
          {
            startTime: "20:00",
            endTime: "22:00",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 300,
        scheduleName: "U16 Boys (Gr. 10)  Spring Club Tryouts For everyone",
      },
      ],
    },

    {
      id: "20",
      details: {
        name: "U17/U18 Boys (Gr. 11 & 12) Spring Club Tryouts // March 11th, 2025",
        description: "March 11th, 2025 6PM - 8PM Non-refundable",
        image: "",
        facilityIds: [
          "Check out Tryout location via website"
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "25$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "0$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "25$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "0$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "25$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2025-03-11",
        endDate: "2025-03-11",
        day: "Tuesday",
        timeScheduleForADay: [
          {
            startTime: "18:00",
            endTime: "20:00",
            locationId: "Check out Tryout location via website",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 300,
        scheduleName: "U17/U18 Boys (Gr. 11 & 12) Spring Club Tryouts For everyone",
      },
      ],
    },

    {
      id: "21",
      details: {
        name: "U17/U18 Girls (Gr. 11 & 12) Spring Club Tryouts // March 10th, 2025",
        description: "March 10th, 2025 6PM - 8PM Non-refundable",
        image: "",
        facilityIds: [
          "Rise_Facility_Calgary_Central_Sportsplex",
        ],
        trainerIds: [
          "Test_Trainer",
        ],
        taxIds: [
          "",
        ],
        useSinglePrice: false,
        eligibility: [
          { planId: "PAYG", isEligible: true, price: "25$" },
          { planId: "Rise_BasketBall_Full_Year_Membership_1", isEligible: true, price: "0$" },
          { planId: "Jr_Rise_Elite_Hooper_Age_5_8" , isEligible: false },
          { planId: "_2025_Spring_Club_Membership", isEligible: false },
          { planId: "Seasonal_Membership_Winter_Rise_League", isEligible: true , price: "25$" },
          { planId: "High_School_Pro_Club", isEligible: false },
          { planId: "Gym_Membership", isEligible: false },
          { planId: "Jr_Rise_Seasonal_3_Months", isEligible: false },
          { planId: "Open_Gym_Strength_Room_and_Courts", isEligible: false },
          { planId: "PAYMENT_PLAN_2025_SPRING_CLUB", isEligible: false },
          { planId: "Rise_BasketBall_Full_Year_Membership_2", isEligible: true , price: "0$" },
          { planId: "Rise_Full_Year_Familty_Member_Guided_Strength_Gym_Membership", isEligible:false },
          { planId: "Seasonal_Membership_Rise_WINTER_LEAGUE", isEligible: true , price: "25$" },
          { planId: "SPRING_RISE_LEAGUE_2025", isEligible: false },
          { planId: "Strength_Room_Unlimited_Membership", isEligible: false },
          // ...repeat for each membership plan
        ],
        private: false,
      },
      schedule: [
        {
        startDate: "2025-03-10",
        endDate: "2025-03-10",
        day: "Monday",
        timeScheduleForADay: [
          {
            startTime: "18:00",
            endTime: "20:00",
            locationId: "Rise_Facility_Calgary_Central_Sportsplex",
            trainerIds: [
              "Test_Trainer"
            ],
          }
        ],
        capacity: 300,
        scheduleName: "U17/U18 Girls (Gr. 11 & 12) Spring Club Tryouts For everyone",
      },
      ],
    },
  ];
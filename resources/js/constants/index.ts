import type { AppSettings } from "@/types/app";

export const TRANSLATIONS = {
  en: {
    common: {
        back: "Back",
    },
    nav: { home: "Home", how: "How It Works", join: "Join Now", login: "Login", register: "Register", logout: "Logout", dashboard: "Dashboard", secure: "Secure Session", profile: "Profile" },
    hero: { subtitle: "NEXT DRAW IN", subtitle_today: "TODAY ONE LUCKY PERSON TAKES THE IPHONE 17 PRO MAX", title1: "Save Together.", title2: "Win the iPhone 17 Pro Max.", desc: "AfroEqub blends Ethiopia's trusted equb tradition with secure digital payments. Contribute monthly, claim your lucky number, and walk away with a brand-new iPhone 17 Pro Max in a fully transparent live draw.", cta: "Claim Your Lucky Number", watch: "Watch Video", prize_name: "iPhone 17 Pro Max" },
    stats: { taken: "Taken Numbers", lucky: "Lucky Numbers" },
    features: {
        heading_sub: "How It Works",
        heading_main: "Three Steps to Your",
        heading_highlight: "New iPhone 17 Pro Max",
        desc: "We've digitized the traditional Equb system to make it secure, transparent, and easy to access from anywhere.",
        step1_title: "Register & Verify",
        step1_desc: "Create your secure account using your phone number.",
        step2_title: "Claim your lucky number",
        step2_desc: "Choose your ticket after your payments easily via Telebirr.",
        step3_title: "Win & Claim",
        step3_desc: "Participate in our transparent monthly live draw and claim your prize."
    },
    cta_section: {
        heading: "Your iPhone 17 Pro Max Is One Contribution Away",
        desc: "Join thousands of members saving together and winning together. Your lucky number is waiting.",
        btn: "Join the Equb Today"
    },
    login: {
        heading: "Member Access",
        heading_login: "Welcome Back",
        heading_register: "Create Account",
        subheading: "Enter your details to access your dashboard",
        subheading_register: "Join the community to start winning",
        auth_layout_title_login: "Log in to your account",
        auth_layout_description_login: "Enter your email and password below to log in",
        auth_layout_title_register: "Create an account",
        auth_layout_description_register: "Enter your details below to create your account",
        head_login: "Log in",
        head_register: "Register",
        label_email: "Email address",
        placeholder_email: "email@example.com",
        label_password: "Password",
        placeholder_password: "Password",
        label_remember: "Remember me",
        link_forgot_password: "Forgot password?",
        label_name: "Name",
        placeholder_name: "Full name",
        label_confirm_password: "Confirm password",
        placeholder_confirm_password: "Confirm password",
        btn_login_action: "Log in",
        btn_register_action: "Create account",
        register_prompt: "Don't have an account?",
        login_prompt: "Already have an account?",
        btn_register: "Sign up",
        name_notice: "Important: Name must match your Kebele ID",
        label_phone: "Phone Number",
        placeholder_phone: "0912345678",
        label_tier: "Monthly Contribution",
        tier_1: "Standard - 500 ETB",
        tier_2: "Standard - 500 ETB",
        tier_3: "Premium - 500 ETB",
        terms_agree: "I agree to the",
        terms_link: "Terms & Conditions",
        btn_login: "Secure Login",
        btn_processing: "Processing...",
        back: "Back to Home",
        btn_login_link: "Login Here"
    },
    dashboard: {
        welcome: "Welcome back,",
        status_pending: "Payment Pending",
        status_verified: "Verified Member",
        contribution: "My Contribution",
        contribution_sub: "this month",
        pot: "Group Pot",
        pot_sub: "Current Total",
        pot_users: "Contributing",
        upload: "Upload Receipt",
        pay_telebirr: "Pay with Telebirr",
        history: "Recent Activity",
        next_draw: "NEXT DRAW IN 14 DAYS",
        next_draw_today: "TODAY ONE LUCKY PERSON WILL TAKE THE IPHONE 17 PRO MAX",
        win_title: "Win an iPhone 17 Pro Max",
        win_desc: "Make your contribution today to enter the draw. Verified members only.",
        btn_paid: "Contribution Paid",
        live_activity: "Live Activity",
        hall_of_fame: "Hall of Fame",
        action_verified: "Verified Payment",
        action_joined: "Joined the Equb",
        status_card_title: "My Status",
        payment_due: "Payment Due",
        btn_processing: "Processing...",
        select_ticket: "Select Lucky Number",
        select_ticket_desc: "Choose a number for the next draw.",
        confirm_ticket: "Confirm Number",
        my_ticket: "My Number",
        ticket_saved: "Lucky Number Claimed!",
        ticket_instruction: "Green numbers are available.",
        change_method: "Change Method",
        confirm_paid: "I Have Paid",
        account_no: "Account Number",
        merchant_id: "Merchant ID",
        acc_name: "Account Name",
        winner_congrats: "CONGRATULATIONS!",
        winner_desc: "You are the winner of the Grand Prize!",
        winner_ticket: "Winning Ticket",
        claim_prize: "Claim Prize"
    },
    terms_page: {
        title: "Terms and Conditions",
        last_updated: "Last Updated: August 2026",
        sections: [
            {
                heading: "1. Acceptance of These Terms",
                content: "By accessing or using this application and any related services (the \"Service\"), you agree to be bound by these Terms and Conditions (\"Terms\"). If you do not agree, do not use the Service.\n\nThese Terms apply to all visitors, users, and others who access or use the Service."
            },
            {
                heading: "2. Eligibility and Account Registration",
                content: "You must be at least 18 years old and capable of forming a binding agreement under applicable law to use the Service.\n\nYou agree to provide accurate information when creating an account and to keep it up to date. You are responsible for safeguarding your account and for all activities that occur under your account."
            },
            {
                heading: "3. The Equb Program and Contributions",
                content: "The Service is designed to help facilitate digital participation in an Equb-style contribution and draw program (the \"Program\"). Program terms such as contribution amounts, payment schedules, draw dates, and eligibility to participate may be set by the Service and may change from time to time.\n\nThe current monthly contribution is 500 ETB (five hundred Ethiopian Birr) per member. This amount may be reviewed and changed by the Service with reasonable notice.\n\nUnless otherwise required by applicable law, contributions and fees (if any) may be non-refundable once a contribution round begins. Missed or late contributions may affect your eligibility for that round, including suspension or ineligibility to participate in the draw."
            },
            {
                heading: "4. Payments, Verification, and Receipts",
                content: "You may be able to submit proof of payment (including receipts or transaction references) for verification. You represent that any payment information you submit is truthful and belongs to you.\n\nWe may request additional information to verify payments or to prevent fraud. We may reject or delay verification if information is incomplete, inconsistent, or appears fraudulent."
            },
            {
                heading: "5. Tickets / Lucky Numbers",
                content: "Where the Service allows selecting a ticket or \"lucky number\", availability is on a first-come, first-served basis and may be subject to verification status and payment confirmation.\n\nWe may prevent, revoke, or reassign tickets if we determine (in our reasonable discretion) that the selection was made through abuse, automation, fraud, or violation of these Terms."
            },
            {
                heading: "6. Draw Process and Results",
                content: "Draws are intended to be conducted using a transparent and random selection process. The specific method and timing of the draw may be published within the Service or through official announcements.\n\nEach draw cycle awards the grand prize, currently an iPhone 17 Pro Max, to one lucky winner. To the extent permitted by law, draw results recorded by the Service are final and binding, subject only to correction of clear technical or administrative errors."
            },
            {
                heading: "7. Prizes and Prize Claims",
                content: "Each draw cycle, one lucky winner receives the grand prize, currently an iPhone 17 Pro Max. Prize details, eligibility rules, and claim requirements will be provided through the Service or official communications. Winners may be required to complete identity verification and provide documentation before receiving a prize.\n\nIf a winner does not respond or complete required steps within a specified claim period, the prize may be forfeited and an alternate winner may be selected, where applicable."
            },
            {
                heading: "8. Prohibited Conduct",
                content: "You agree not to misuse the Service. This includes, but is not limited to: attempting to gain unauthorized access; using automation to claim tickets; submitting fraudulent receipts; interfering with the Service’s normal operation; or using the Service for unlawful activities.\n\nWe may suspend or terminate accounts involved in prohibited conduct."
            },
            {
                heading: "9. Suspension and Termination",
                content: "We may suspend, restrict, or terminate your access to the Service at any time if we believe you have violated these Terms, created risk, or engaged in fraud or misuse.\n\nYou may stop using the Service at any time. Some obligations (including payment obligations for contribution rounds already started, where applicable) may survive termination."
            },
            {
                heading: "10. Disclaimers",
                content: "The Service is provided on an \"as is\" and \"as available\" basis. We do not guarantee uninterrupted access, error-free operation, or that the Service will meet your requirements.\n\nTo the maximum extent permitted by law, we disclaim all warranties, express or implied, including fitness for a particular purpose and non-infringement."
            },
            {
                heading: "11. Limitation of Liability",
                content: "To the maximum extent permitted by law, we will not be liable for indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, data, or goodwill arising out of or related to your use of the Service.\n\nWhere liability cannot be excluded, it will be limited to the minimum amount permitted by applicable law."
            },
            {
                heading: "12. Privacy",
                content: "Your use of the Service is also governed by our Privacy Policy, which explains how we collect, use, and share information."
            },
            {
                heading: "13. Changes to These Terms",
                content: "We may update these Terms from time to time. If we make material changes, we will take reasonable steps to notify you through the Service. Continued use of the Service after changes become effective means you accept the updated Terms."
            },
            {
                heading: "14. Contact",
                content: "If you have questions about these Terms, please contact us using the contact information provided in the Service."
            }
        ]
    },
    privacy_page: {
        title: "Privacy Policy",
        last_updated: "Last Updated: February 2026",
        sections: [
            {
                heading: "1. Overview",
                content: "This Privacy Policy explains how we collect, use, disclose, and protect your information when you use the Service.\n\nBy using the Service, you understand and agree to the practices described in this Privacy Policy."
            },
            {
                heading: "2. Information We Collect",
                content: "We may collect the following types of information:\n\n- Account information such as name, phone number, and other details you provide.\n- Verification information such as identity details where required to confirm eligibility or prize claims.\n- Payment-related information such as transaction references, receipt images, declared amounts, and payment timestamps (we do not recommend sharing unnecessary sensitive data).\n- Usage information such as pages visited, actions taken, device and browser information, and approximate location derived from IP address."
            },
            {
                heading: "3. How We Use Your Information",
                content: "We use information to:\n\n- Provide and operate the Service (including account creation, ticket selection, draw participation, and notifications).\n- Verify payments and prevent fraud, abuse, and unauthorized access.\n- Communicate with you about your account, the Program, and changes to the Service.\n- Improve, monitor, and maintain the Service, including debugging and security."
            },
            {
                heading: "4. How We Share Your Information",
                content: "We may share information in limited circumstances:\n\n- With service providers who help us operate the Service (e.g., hosting, analytics, customer support), under appropriate confidentiality obligations.\n- To comply with legal obligations, lawful requests, or to protect rights, safety, and security.\n- In connection with a business transaction (e.g., restructuring), where permitted by law."
            },
            {
                heading: "5. Retention",
                content: "We retain personal information only as long as necessary to provide the Service, meet legal or regulatory requirements, resolve disputes, and enforce agreements.\n\nRetention periods may vary depending on the type of data and the purpose for which it is processed."
            },
            {
                heading: "6. Security",
                content: "We implement reasonable technical and organizational measures designed to protect your information. However, no security system is perfect, and we cannot guarantee absolute security.\n\nYou are responsible for keeping your login credentials confidential and for using the Service on trusted devices."
            },
            {
                heading: "7. Cookies and Local Storage",
                content: "We may use cookies and local storage to keep you signed in, remember your language preference, and support basic functionality.\n\nYou can control cookies through your browser settings, but disabling certain cookies may affect the Service."
            },
            {
                heading: "8. Your Choices and Rights",
                content: "Depending on applicable law, you may have rights to access, correct, delete, or object to certain processing of your personal information.\n\nTo make a request, contact us using the contact information provided in the Service. We may need to verify your identity before fulfilling requests."
            },
            {
                heading: "9. Children’s Privacy",
                content: "The Service is not intended for individuals under 18. We do not knowingly collect personal information from children. If you believe a child has provided personal information, please contact us so we can take appropriate action."
            },
            {
                heading: "10. Changes to This Privacy Policy",
                content: "We may update this Privacy Policy from time to time. If we make material changes, we will take reasonable steps to notify you through the Service. The \"Last Updated\" date indicates when this Privacy Policy was last revised."
            },
            {
                heading: "11. Contact",
                content: "If you have questions about this Privacy Policy or our privacy practices, please contact us using the contact information provided in the Service."
            }
        ]
    },
    footer: {
        desc: "We have transformed the traditional Ethiopian Equb into a modern digital asset.",
        contact: "Contact",
        social: "Social Media",
        rights: "AfroEqub.",
        terms: "Terms & Conditions",
        privacy: "Privacy Policy"
    }
  },
  am: {
    common: {
        back: "ተመለስ",
    },
    nav: { home: "መነሻ", how: "እንዴት ይሰራል", join: "ይመዝገቡ", login: "ይግቡ", register: "ይመዝገቡ", logout: "ውጣ", dashboard: "ዳሽቦርድ", secure: "ደህንነቱ የተጠበቀ", profile: "ፕሮፋይል" },
    hero: { subtitle: "እጣ ለመውጣት የቀረው ጊዜ:", subtitle_today: "ዛሬ አንድ እድለኛ ሰው አይፎን 17 ፕሮ ማክስ ይረከባል", title1: "አብረው ይቆጥቡ።", title2: "አይፎን 17 ፕሮ ማክስ ያሸንፉ።", desc: "አፍሮ እቁብ የኢትዮጵያን የተማመነ የእቁብ ባህል ከደህንነቱ ከተጠበቀ ዲጂታል ክፍያ ጋር ያጣምራል። በየወሩ ይዋጩ፣ እድለኛ ቁጥርዎን ይያዙ እና በግልጽ በሚተላለፍ የእጣ ሂደት አዲስ አይፎን 17 ፕሮ ማክስ ያሸንፉ።", cta: "የእድለኛ ቁጥርዎን ዛሬ ይያዙ", watch: "ቪዲዮ ይመልከቱ", prize_name: "አይፎን 17 ፕሮ ማክስ" },
    stats: { taken: "የተያዙ ቁጥሮች", lucky: "እድለኛ ቁጥሮች" },
    features: {
        heading_sub: "እንዴት ይሰራል",
        heading_main: "ወደ አዲሱ አይፎን 17 ፕሮ ማክስ የሚወስዱ",
        heading_highlight: "ሶስት ደረጃዎች",
        desc: "ባህላዊውን የእቁብ ስርዓት ደህንነቱ የተጠበቀ፣ ግልጽ እና ከየትኛውም ቦታ ሆነው በቀላሉ የሚሳተፉበት አድርገን ዘምነነዋል።",
        step1_title: "ይመዝገቡ እና ያረጋግጡ",
        step1_desc: "ስልክ ቁጥርዎን በመጠቀም ደህንነቱ የተጠበቀ መለያ ይፍጠሩ።",
        step2_title: "እድለኛ ቁጥርዎን ይምረጡ",
        step2_desc: "ክፍያዎን በቀላሉ በቴሌቢር ከፈጸሙ በኋላ ቲኬትዎን ይምረጡ።",
        step3_title: "ያሸንፉ እና ይቀበሉ",
        step3_desc: "በየወሩ በሚካሄደው ግልጽ የእጣ አወጣጥ ላይ ይሳተፉ እና ሽልማትዎን ይቀበሉ።"
    },
    cta_section: {
        heading: "አይፎን 17 ፕሮ ማክስዎ በአንድ ክፍያ ርቀት ላይ ነው",
        desc: "አብረው የሚቆጥቡ እና አብረው የሚያሸንፉ በሺዎች የሚቆጠሩ አባላትን ይቀላቀሉ። የእድለኛ ቁጥርዎ ይጠብቅዎታል።",
        btn: "እቁቡን አሁኑኑ ይቀላቀሉ"
    },
    login: {
        heading: "የአባላት መግቢያ",
        heading_login: "እንኳን ደህና መጡ",
        heading_register: "መለያ ይፍጠሩ",
        subheading: "ወደ ዳሽቦርድ ለመግባት መረጃዎን ያስገቡ",
        subheading_register: "ማህበረሰቡን ተቀላቅለው ማሸነፍ ይጀምሩ",
        auth_layout_title_login: "ወደ መለያዎ ይግቡ",
        auth_layout_description_login: "ለመግባት ኢሜይልዎን እና የይለፍ ቃልዎን ከታች ያስገቡ",
        auth_layout_title_register: "መለያ ይፍጠሩ",
        auth_layout_description_register: "መለያ ለመፍጠር መረጃዎን ከታች ያስገቡ",
        head_login: "ግባ",
        head_register: "ይመዝገቡ",
        label_email: "ኢሜይል አድራሻ",
        placeholder_email: "email@example.com",
        label_password: "የይለፍ ቃል",
        placeholder_password: "የይለፍ ቃል",
        label_remember: "አስታውሰኝ",
        link_forgot_password: "የይለፍ ቃል ረሱ?",
        label_name: "ስም",
        placeholder_name: "ሙሉ ስም",
        label_confirm_password: "የይለፍ ቃል አረጋግጥ",
        placeholder_confirm_password: "የይለፍ ቃል አረጋግጥ",
        btn_login_action: "ግባ",
        btn_register_action: "መለያ ፍጠር",
        register_prompt: "መለያ የለዎትም?",
        login_prompt: "መለያ አለዎት?",
        btn_register: "ይመዝገቡ",
        name_notice: "ማሳሰቢያ: ስምዎ በመታወቂያ ላይ ካለው ጋር መመሳሰል አለበት",
        label_phone: "ስልክ ቁጥር",
        placeholder_phone: "0912345678",
        label_tier: "ወራዊ ክፍያ",
        tier_1: "መደበኛ - 500 ብር",
        tier_2: "መደበኛ - 500 ብር",
        tier_3: "ፕሪሚየም - 500 ብር",
        terms_agree: "በ",
        terms_link: "ውሎች እና ሁኔታዎች እስማማለሁ",
        btn_login: "ይግቡ",
        btn_processing: "በማስኬድ ላይ...",
        back: "ወደ መነሻ ተመለስ",
        btn_login_link: "እዚህ ይግቡ"
    },
    dashboard: {
        welcome: "እንኳን ደህና መጡ፣",
        status_pending: "ክፍያ ይጠበቃል",
        status_verified: "የተረጋገጠ አባል",
        contribution: "የእኔ ቁጠባ",
        contribution_sub: "በዚህ ወር",
        pot: "የቡድን እቁብ",
        pot_sub: "የአሁን ጠቅላላ",
        pot_users: "አባላት",
        upload: "ደረሰኝ ላክ",
        pay_telebirr: "በቴሌብር ይክፈሉ",
        history: "የቅርብ ጊዜ እንቅስቃሴዎች",
        next_draw: "የእጣ ቀን የቀረው ጊዜ: 14 ቀናት",
        next_draw_today: "ዛሬ አንድ እድለኛ ሰው አይፎን 17 ፕሮ ማክስ ይረከባል",
        win_title: "አይፎን 17 ፕሮ ማክስ ያሸንፉ",
        win_desc: "በእጣው ለመሳተፍ ክፍያዎን ዛሬውኑ ይፈጽሙ። የተረጋገጡ አባላት ብቻ።",
        btn_paid: "ክፍያ ተፈጽሟል",
        live_activity: "የቀጥታ እንቅስቃሴ",
        hall_of_fame: "የዝና አዳራሽ",
        action_verified: "ክፍያ ተረጋግጧል",
        action_joined: "እቁቡን ተቀላቅለዋል",
        status_card_title: "የኔ ሁኔታ",
        payment_due: "የክፍያ ቀን",
        btn_processing: "በማስኬድ ላይ...",
        select_ticket: "እድለኛ ቁጥር ይምረጡ",
        select_ticket_desc: "ለቀጣዩ እጣ የሚሆን ቁጥር ይምረጡ።",
        confirm_ticket: "ቁጥሩን አረጋግጥ",
        my_ticket: "የእኔ ቁጥር",
        ticket_saved: "የእድለኛ ቁጥር ተያዙ!",
        ticket_instruction: "አረንጓዴ ቁጥሮች ክፍት ናቸው።",
        change_method: "ዘዴ ቀይር",
        confirm_paid: "ክፍያ ፈጽሚያለሁ",
        account_no: "የሂሳብ ቁጥር",
        merchant_id: "የንግድ መለያ",
        acc_name: "የሂሳብ ስም",
        winner_congrats: "እንኳን ደስ አለዎት!",
        winner_desc: "የታላቅ ሽልማት አሸናፊ እርስዎ ነዎት!",
        winner_ticket: "አሸናፊ ቲኬት",
        claim_prize: "ሽልማቱን ይቀበሉ"
    },
    terms_page: {
        title: "ውሎች እና ሁኔታዎች",
        last_updated: "ለመጨረሻ ጊዜ የተሻሻለው: ነሐሴ 2018",
        sections: [
            {
                heading: "1. ውሎቹን መቀበል",
                content: "ይህን መተግበሪያ እና ተያያዥ አገልግሎቶቹን (\"አገልግሎት\") በመጠቀም ይህን ውሎች እና ሁኔታዎች (\"ውሎች\") ለመከተል ይስማማሉ። ካልተስማሙ አገልግሎቱን አይጠቀሙ።\n\nይህ ውሎች ለሁሉም ጎብኚዎች እና ተጠቃሚዎች ይተገበራሉ።"
            },
            {
                heading: "2. ብቁነት እና መመዝገብ",
                content: "አገልግሎቱን ለመጠቀም ቢያንስ 18 ዓመት መሆን እና በህግ መሠረት የሚገባ ስምምነት ማድረግ መቻል አለብዎት።\n\nመለያ ሲፈጥሩ ትክክለኛ መረጃ መስጠት እና መረጃዎን ማዘመን ይጠበቅበታል። መለያዎን ለመጠበቅ እና በመለያዎ የሚፈጸሙ ተግባራት ሁሉ ሃላፊነቱ የእርስዎ ነው።"
            },
            {
                heading: "3. የእቁብ ፕሮግራም እና መዋጮ",
                content: "አገልግሎቱ በዲጂታል መንገድ የእቁብ ዓይነት መዋጮ እና የእጣ ሂደት (\"ፕሮግራም\") ለማስተናገድ ተዘጋጅቷል። እንደ መዋጮ መጠን፣ የክፍያ መርሐግብር፣ የእጣ ቀን እና የብቁነት መስፈርቶች በአገልግሎቱ ሊወሰኑ እና ከጊዜ ወደ ጊዜ ሊቀየሩ ይችላሉ።\n\nየአሁኑ ወራዊ መዋጮ በአባል 500 ብር (አምስት መቶ የኢትዮጵያ ብር) ነው። ይህ መጠን በአገልግሎቱ ሊገመገም እና በተገቢው ማስታወቂያ ሊለወጥ ይችላል።\n\nህግ ካልጠየቀ በቀር የክፍያ ጊዜ ከተጀመረ በኋላ የተከፈሉ መዋጮዎች ወይም ክፍያዎች (ካሉ) ተመላሽ ሊሆኑ አይችሉም። ዘግይቶ ወይም ሳይከፈል ከቀረ ክፍያ በዚያ የክፍያ ጊዜ ላይ ብቁነትዎን ሊነካ ይችላል።"
            },
            {
                heading: "4. ክፍያ ማረጋገጫ እና ደረሰኞች",
                content: "ክፍያ ማረጋገጫ ለማድረግ ደረሰኝ ወይም የግብይት ማስረጃ ሊጫኑ ይችላሉ። የሚጫኑት መረጃ ትክክለኛ እና የእርስዎ መሆኑን ታረጋግጣላችሁ።\n\nማጭበርበር ለመከላከል ተጨማሪ መረጃ ልንጠይቅ እንችላለን። መረጃው ካልተሟላ ወይም አስተማማኝ ካልሆነ ማረጋገጡ ሊዘገይ ወይም ሊታገድ ይችላል።"
            },
            {
                heading: "5. ቲኬት / እድለኛ ቁጥር",
                content: "አገልግሎቱ ቲኬት ወይም \"እድለኛ ቁጥር\" መምረጥ ካስቻለ፣ ብቁነት እና የክፍያ ማረጋገጫ መሰረት ሊሆን ይችላል፣ እንዲሁም በመጀመሪያ የደረሰ ቅድሚያ ሊሆን ይችላል።\n\nበአግባቡ መጠቀም ካልሆነ (ማጭበርበር፣ ራስ-ሰር መንገዶች መጠቀም ወዘተ) ቲኬት መከልከል ወይም መመለስ ሊደረግ ይችላል።"
            },
            {
                heading: "6. የእጣ ሂደት እና ውጤት",
                content: "እጣው በግልጽ እና በዘፈቀደ መንገድ እንዲካሄድ ይታሰባል። የእጣ ዘዴ እና ጊዜ በመተግበሪያው ውስጥ ወይም በይፋ ማስታወቂያ ሊገለጽ ይችላል።\n\nበእያንዳንዱ የእጣ ዙር ዋናው ሽልማት (በአሁኑ ጊዜ አይፎን 17 ፕሮ ማክስ) ለአንድ እድለኛ አሸናፊ ይሰጣል። ህግ በሚፈቅደው መጠን ውስጥ በአገልግሎቱ የተመዘገበ ውጤት የመጨረሻ ነው፣ ከግልጽ ቴክኒካዊ ወይም አስተዳደራዊ ስህተት ማስተካከል በስተቀር።"
            },
            {
                heading: "7. ሽልማቶች እና ሽልማት መቀበል",
                content: "በእያንዳንዱ የእጣ ዙር አንድ እድለኛ አሸናፊ ዋናውን ሽልማት ይቀበላል፣ በአሁኑ ጊዜ አይፎን 17 ፕሮ ማክስ። የሽልማቱ ዝርዝሮች፣ የብቁነት መመሪያዎች እና የማረጋገጫ መስፈርቶች በመተግበሪያው ውስጥ ወይም በይፋ ግንኙነት ይገለጻሉ። አሸናፊዎች ማንነት ማረጋገጫ ማቅረብ ሊያስፈልጋቸው ይችላል።\n\nበተወሰነ ጊዜ ውስጥ ካልተገናኙ ወይም የሚያስፈልጉ እርምጃዎችን ካላጠናቀቁ ሽልማቱ ሊሰረዝ እና ሌላ አሸናፊ ሊመረጥ ይችላል።"
            },
            {
                heading: "8. የተከለከለ አጠቃቀም",
                content: "አገልግሎቱን በማጭበርበር ወይም በማጥፋት መጠቀም አይፈቀድም። ይህ ያካትታል፦ ያልተፈቀደ መዳረሻ ለመሞከር፣ ቲኬት ለመያዝ ራስ-ሰር መንገዶች መጠቀም፣ የሐሰት ደረሰኝ መላክ፣ የአገልግሎቱን መስራት ማበላሸት ወዘተ።\n\nእንደዚህ ያሉ ተግባራት ቢገኙ መለያ መታገድ ወይም መዘጋት ሊፈጸም ይችላል።"
            },
            {
                heading: "9. መታገድ እና መዘጋት",
                content: "ውሎቹን ካልከተሉ ወይም አደጋ እንደሚፈጥሩ ካመንን መለያዎን ለጊዜው ማስቆም ወይም መዘጋት እንችላለን።\n\nእርስዎ በማንኛውም ጊዜ መጠቀምን ማቆም ይችላሉ። (የተጀመሩ ዙሮች ግን ካሉ ግዴታዎች ሊቀጥሉ ይችላሉ።)"
            },
            {
                heading: "10. ማስተባበሪያ",
                content: "አገልግሎቱ በ\"እንዳለ\" እና በ\"እንደሚገኝ\" መልኩ ይሰጣል። ሁልጊዜ ያለ መቋረጥ እንዲሰራ ወይም ስህተት እንዳይኖር አናረጋግጥም።\n\nህግ በሚፈቅደው መጠን ውስጥ ሁሉንም ዋስትናዎች እንወድቃለን።"
            },
            {
                heading: "11. የተጠያቂነት ገደብ",
                content: "ህግ በሚፈቅደው መጠን ውስጥ ከአገልግሎቱ አጠቃቀም የሚመጡ ተጨማሪ ወይም ተከታታይ ጉዳቶች ላይ ተጠያቂ አንሆንም (ገንዘብ፣ ዳታ፣ ክብር መጥፋት ወዘተ)።\n\nተጠያቂነት ሊገደብ ባይችል ቢያንስ በህግ የተፈቀደውን መጠን ያከብራል።"
            },
            {
                heading: "12. ግላዊነት",
                content: "አገልግሎቱን መጠቀምዎ ከ\"የግላዊነት መመሪያ\" ጋር ይገናኛል፣ እና መረጃ እንዴት እንደምንሰበስብ፣ እንዴት እንደምንጠቀም እና እንዴት እንደምንጋራ ይገልጻል።"
            },
            {
                heading: "13. ውሎች ለውጥ",
                content: "እነዚህን ውሎች ከጊዜ ወደ ጊዜ ልናዘምን እንችላለን። ጉልህ ለውጥ ካደረግን በመተግበሪያው ውስጥ ማሳወቂያ ለመስጠት እንሞክራለን። ከለውጡ በኋላ መቀጠል የተሻሻሉትን ውሎች መቀበል ማለት ነው።"
            },
            {
                heading: "14. አግኙን",
                content: "ስለ ውሎቹ ጥያቄ ካለዎት በመተግበሪያው ውስጥ በተገለጸው የመገናኛ መረጃ ያግኙን።"
            }
        ]
    },
    privacy_page: {
        title: "የግላዊነት መመሪያ",
        last_updated: "ለመጨረሻ ጊዜ የተሻሻለው: የካቲት 2018",
        sections: [
            {
                heading: "1. አጠቃላይ ገለጻ",
                content: "ይህ የግላዊነት መመሪያ አገልግሎቱን ሲጠቀሙ መረጃዎን እንዴት እንደምንሰበስብ፣ እንዴት እንደምንጠቀም፣ እንዴት እንደምንጋራ እና እንዴት እንደምንጠብቅ ያብራራል።\n\nአገልግሎቱን በመጠቀም በዚህ መመሪያ ውስጥ ተገልጹ ልምዶችን ተረድተው እንደምትቀበሉ ያሳያል።"
            },
            {
                heading: "2. የምንሰበስበው መረጃ",
                content: "እነዚህን ዓይነት መረጃዎች ልንሰበስብ እንችላለን፦\n\n- እንደ ስም፣ ስልክ ቁጥር እና ሌሎች የመለያ መረጃዎች።\n- ለብቁነት ወይም ለሽልማት መቀበል የሚያስፈልግ የማረጋገጫ መረጃ።\n- እንደ የግብይት መለያ/ሪፈረንስ፣ የደረሰኝ ምስል፣ የተገለጸ መጠን እና ቀን-ሰዓት ያሉ የክፍያ ማስረጃዎች።\n- እንደ የመሣሪያ እና የብራውዘር መረጃ፣ የገጽ ጉብኝት እና የአጠቃቀም መረጃ።"
            },
            {
                heading: "3. መረጃን እንዴት እንጠቀማለን",
                content: "መረጃን ለሚከተሉት አላማዎች እንጠቀማለን፦\n\n- አገልግሎቱን ለማቅረብ እና ለማስተዳደር (መለያ ፍጠር፣ ቲኬት መምረጥ፣ ተሳትፎ እና ማሳወቂያዎች)።\n- ክፍያ ለማረጋገጥ እና ማጭበርበር ለመከላከል።\n- ስለ መለያዎ ወይም ስለ ለውጦች ለማሳወቅ እና ለመገናኘት።\n- አገልግሎቱን ለማሻሻል፣ ለማሳሰብ እና ለደህንነት ለመጠበቅ።"
            },
            {
                heading: "4. መረጃን እንዴት እንጋራለን",
                content: "መረጃን በተወሰኑ ሁኔታዎች ብቻ ልንጋራ እንችላለን፦\n\n- አገልግሎቱን ለማስኬድ የሚረዱን አገልግሎት አቅራቢዎች ጋር (እንደ ሆስቲንግ እና ድጋፍ) በሚገባ የሚስጥር ግዴታ ስር።\n- ህጋዊ ግዴታ ሲኖር ወይም ደህንነትን ለመጠበቅ ሲያስፈልግ።\n- በንግድ ለውጥ/ማዋሃድ ሁኔታ ሲኖር ህግ በሚፈቅደው መጠን ውስጥ።"
            },
            {
                heading: "5. የመረጃ ማቆያ ጊዜ",
                content: "መረጃዎን አገልግሎቱን ለማቅረብ፣ ህጋዊ/የቁጥጥር ግዴታዎችን ለማሟላት እና ግጭቶችን ለመፍታት የሚያስፈልገውን ጊዜ ብቻ እንቆይበታለን።\n\nየማቆያ ጊዜዎች እንደ መረጃው ዓይነት እና አላማ ሊለያዩ ይችላሉ።"
            },
            {
                heading: "6. ደህንነት",
                content: "መረጃዎን ለመጠበቅ ተገቢ ቴክኒካዊ እና የአስተዳደር መለኪያዎችን እንወስዳለን። ነገር ግን ፍጹም ደህንነት መዋል አይቻልም።\n\nየመግቢያ መረጃዎን መጠበቅ እና በታማኝ መሣሪያ ላይ መጠቀም የእርስዎ ሃላፊነት ነው።"
            },
            {
                heading: "7. ኩኪዎች እና ሎካል ስቶረጅ",
                content: "መግባትዎን ለማስቀመጥ፣ የቋንቋ ምርጫዎን ለማስታወስ እና መሠረታዊ ተግባር ለማስቻል ኩኪዎች እና ሎካል ስቶረጅ ልንጠቀም እንችላለን።\n\nኩኪዎችን በብራውዘር ቅንብር መቆጣጠር ይችላሉ፣ ነገር ግን አንዳንድ ተግባራት ሊታገዱ ይችላሉ።"
            },
            {
                heading: "8. ምርጫዎችዎ እና መብቶችዎ",
                content: "በተፈጻሚ ህግ መሠረት መረጃዎን ማግኘት፣ ማስተካከል፣ መሰረዝ ወይም የተወሰነ አሰራር ላይ መቃወም መብት ሊኖርዎት ይችላል።\n\nጥያቄ ለማቅረብ በመተግበሪያው ውስጥ ባለው የመገናኛ መረጃ ያግኙን። ጥያቄዎን ከመፈጸም በፊት ማንነት ማረጋገጫ ልንጠይቅ እንችላለን።"
            },
            {
                heading: "9. የልጆች ግላዊነት",
                content: "አገልግሎቱ ከ18 ዓመት በታች ለሆኑ ግለሰቦች አልተዘጋጀም። ከልጆች መረጃ በግዴታ አንሰበስብም። ልጅ መረጃ እንደሰጠ ካመኑ እባክዎ ያግኙን።"
            },
            {
                heading: "10. የመመሪያው ለውጥ",
                content: "ይህን የግላዊነት መመሪያ ከጊዜ ወደ ጊዜ ልናዘምን እንችላለን። ጉልህ ለውጥ ካደረግን በመተግበሪያው ውስጥ ማሳወቂያ ለመስጠት እንሞክራለን። የ\"ለመጨረሻ ጊዜ የተሻሻለው\" ቀን መመሪያው መቼ እንደተሻሻለ ያሳያል።"
            },
            {
                heading: "11. አግኙን",
                content: "ስለ ይህ የግላዊነት መመሪያ ወይም ስለ የግላዊነት ልምዶቻችን ጥያቄ ካለዎት በመተግበሪያው ውስጥ በተገለጸው የመገናኛ መረጃ ያግኙን።"
            }
        ]
    },
    footer: {
        desc: "ባህላዊውን የኢትዮጵያ እቁብ ወደ ዘመናዊ ዲጂታል ንብረትነት ቀይረነዋል።",
        contact: "አድራሻ",
        social: "ማህበራዊ ሚዲያ",
        rights: "አፍሮ እቁብ።",
        terms: "ውሎች እና ሁኔታዎች",
        privacy: "የግላዊነት መመሪያ"
    }
  }
};

export const PRIZE_IMAGES = [
  "/images/iphone1.jpg",
  "/images/iphone2.jpg"
];

export const DEFAULT_SETTINGS : AppSettings = {
  nextDrawDateEn: 'Yekatit 21, 2018',
  nextDrawDateAm: 'የካቲት 21፣ 2018',
  potValue: 50450000,
  totalMembers: 2150,
  cycle: 1,
  daysRemaining: 14,
  drawDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
  iphonesDelivered: 142,
  trustScore: 100,
  prizeName: 'iPhone 17 Pro Max',
  prizeValue: '1,199 USD',
  prizeImage: PRIZE_IMAGES[0],
  prizeImages: PRIZE_IMAGES, // Initialize with constant values
  liveStreamUrl: '',
  isLive: false,
  registrationEnabled: true,
  adminPassword: 'admin123',
  ticketSelectionEnabled: true, // Default to enabled
  winnerAnnouncementMode: false, // Default to disabled
  recentWinners: [
    {
      id: 1,
      name: "Dawit M.",
      nameAm: "ዳዊት መ.",
      prize: "iPhone 17 Pro Max",
      prizeAm: "አይፎን 17 ፕሮ ማክስ",
      cycle: "Tir (Jan)",
      cycleAm: "ጥር",
      location: "Addis Ababa",
      locationAm: "አዲስ አበባ"
    },
    {
      id: 2,
      name: "Sara T.",
      nameAm: "ሳራ ት.",
      prize: "iPhone 17 Pro Max",
      prizeAm: "አይፎን 17 ፕሮ ማክስ",
      cycle: "Tahsas (Dec)",
      cycleAm: "ታህሳስ",
      location: "Adama",
      locationAm: "አዳማ"
    }
  ]
};

export const ADMIN_TRANSLATIONS = {
  en: {
    sidebar: {
      title: "Admin Panel",
      dashboard: "Dashboard",
      competition: "Competition",
      prizes: "Prizes",
      users: "User Management",
      payments: "Verify Payments",
      notifications: "Notifications",
      settings: "App Settings",
      exit: "Exit Admin"
    },
    notifications: {
      breadcrumb: "Notifications",
      headTitle: "Notification Management",
      pageTitle: "Notification Center",
      subtitle: "Manage system broadcasts and view transmission history.",
      stats: {
        total: "Total",
        unread: "Unread",
        urgent: "Urgent"
      },
      tabs: {
        history: "History",
        compose: "Compose"
      },
      search: {
        placeholder: "Search by title..."
      },
      filters: {
        all: "All",
        unread: "Unread",
        urgent: "Urgent"
      },
      badges: {
        urgent: "Urgent",
        standard: "Standard",
        read: "Read",
        unread: "Unread"
      },
      actions: {
        markRead: "Mark read",
        markUnread: "Mark unread",
        delete: "Delete",
        cancel: "Cancel"
      },
      compose: {
        title: "Create System Broadcast",
        description: "Compose a message to be sent to all active users.",
        englishContent: "English Content",
        amharicContent: "Amharic Content",
        fields: {
          titleEn: "Notification Title",
          messageEn: "Message Body",
          titleAm: "Notification Title (Amharic)",
          messageAm: "Message Body (Amharic)",
          actionLink: "Action Link (Optional)",
          urgentBroadcast: "Urgent Broadcast"
        },
        placeholders: {
          titleEn: "e.g., System Maintenance",
          messageEn: "Enter the detailed message...",
          titleAm: "ለምሳሌ፦ የስርዓት ጥገና",
          messageAm: "ዝርዝር መልእክቱን እዚህ ያስገቡ...",
          actionLink: "https://"
        },
        configuration: "Configuration",
        actionLinkHint: "Users will be redirected here when they click the notification.",
        urgentHint: "Highlights the notification in red and pins it to top.",
        resetFields: "Reset Fields",
        broadcasting: "Broadcasting...",
        sendBroadcast: "Send Broadcast"
      },
      deleteDialog: {
        title: "Delete notification",
        descriptionPrefix: "This will remove the notification from the demo history."
      }
    },
    dashboard: {
      overview: "Dashboard Overview",
      totalPot: "Total Pot",
      claimedTickets: "Claimed Tickets",
      totalMembers: "Total Members",
      pending: "Pending Verifications",
      cycle: "Current Cycle",
      cycleTitle: "Cycle Management",
      cycleDesc: "Control the current lottery cycle status",
      active: "Active",
      startNew: "Start New Cycle",
      nextDraw: "Next Draw",
      daysRem: "days remaining",
      recentPay: "Recent Payment Requests",
      viewAll: "View All",
      noPending: "No pending payments.",
      user: "User ID",
      amount: "Amount",
      date: "Date",
      action: "Action",
      review: "Review"
    },
    competition: {
      title: "Competition Management",
      general: "General Settings",
      tickets: "Ticket Management",
      drawSchedule: "Draw Schedule",
      setNextDraw: "Set Next Draw Date (Ethiopian Calendar)",
      preview: "Preview",
      save: "Save Changes",
      currentPrize: "Current Prize",
      prizeName: "Prize Name",
      prizeValue: "Prize Value",
      prizeImages: "Prize Images",
      liveStream: "Live Stream",
      liveStatus: "Live Status"
    },
    prizes: {
      title: "Prize Management",
      liveAnnouncer: "Live Draw Announcer",
      liveDesc: "Use this tool during the live event to broadcast the winner to all connected users instantly.",
      winTicket: "Winning Ticket Number",
      verify: "Verify Ticket",
      announce: "ANNOUNCE WINNER LIVE",
      hallOfFame: "Hall of Fame (Past Winners)",
      hallDesc: "Manage the list of winners displayed on the Prizes page.",
      addWinner: "Add Past Winner"
    },
    users: {
      title: "User Management",
      addNew: "Add New User",
      search: "Search by name or phone...",
      allStatus: "All Status",
      verified: "Verified",
      pending: "Pending",
      contrib: "Contribution",
      ticket: "Ticket #",
      actions: "Actions",
      showing: "Showing",
      total: "Total Users",
      status: "Status",
      phone: "Phone"
    },
    payments: {
      title: "Pending Payments",
      allCaughtUp: "All Caught Up!",
      noRequests: "There are no pending payment requests to verify at this time.",
      amount: "Amount Declared",
      reject: "Reject",
      approve: "Approve"
    },
    settings: {
      title: "App Settings",
      general: "General Preferences",
      langTitle: "Admin Dashboard Language",
      langDesc: "Toggle the language settings for the admin dashboard.",
      security: "Account & Security",
      userReg: "User Registration",
      userRegDesc: "Allow new users to create accounts",
      changePass: "Change Admin Password",
      update: "Update",
      save: "Save Changes"
    },
    login: {
      title: "Admin Portal",
      label: "Access Key",
      btn: "Login",
      back: "Back to Site",
      placeholder: "Enter password",
      failed: "Login Failed",
      failedMsg: "The access key you provided is incorrect. Please try again."
    }
  },
  am: {
    sidebar: {
      title: "አድሚን ፓነል",
      dashboard: "ዳሽቦርድ",
      competition: "ውድድር",
      prizes: "ሽልማቶች",
      users: "ተጠቃሚዎች",
      payments: "ክፍያ ማረጋገጫ",
      notifications: "ማሳወቂያዎች",
      settings: "ቅንብሮች",
      exit: "ውጣ"
    },
    notifications: {
      breadcrumb: "ማሳወቂያዎች",
      headTitle: "የማሳወቂያ አስተዳደር",
      pageTitle: "የማሳወቂያ ማዕከል",
      subtitle: "የስርዓት ማስተላለፊያዎችን ያስተዳድሩ እና የተላኩ መልእክቶችን ታሪክ ይመልከቱ።",
      stats: {
        total: "ጠቅላላ",
        unread: "ያልተነበቡ",
        urgent: "አስቸኳይ"
      },
      tabs: {
        history: "ታሪክ",
        compose: "ላክ"
      },
      search: {
        placeholder: "በርዕስ ይፈልጉ..."
      },
      filters: {
        all: "ሁሉም",
        unread: "ያልተነበቡ",
        urgent: "አስቸኳይ"
      },
      badges: {
        urgent: "አስቸኳይ",
        standard: "መደበኛ",
        read: "ተነብቧል",
        unread: "ያልተነበበ"
      },
      actions: {
        markRead: "ተነብቧል አድርግ",
        markUnread: "ያልተነበበ አድርግ",
        delete: "ሰርዝ",
        cancel: "ተው"
      },
      compose: {
        title: "የስርዓት ማስታወቂያ ፍጠር",
        description: "ለሁሉም ንቁ ተጠቃሚዎች የሚላክ መልእክት ያቀናብሩ።",
        englishContent: "የእንግሊዝኛ ይዘት",
        amharicContent: "የአማርኛ ይዘት",
        fields: {
          titleEn: "የማሳወቂያ ርዕስ",
          messageEn: "የመልእክት ይዘት",
          titleAm: "የማሳወቂያ ርዕስ (አማርኛ)",
          messageAm: "የመልእክት ይዘት (አማርኛ)",
          actionLink: "የእርምጃ አገናኝ (አማራጭ)",
          urgentBroadcast: "አስቸኳይ ማስታወቂያ"
        },
        placeholders: {
          titleEn: "ለምሳሌ፦ System Maintenance",
          messageEn: "ዝርዝር መልእክቱን እዚህ ያስገቡ...",
          titleAm: "ለምሳሌ፦ የስርዓት ጥገና",
          messageAm: "ዝርዝር መልእክቱን እዚህ ያስገቡ...",
          actionLink: "https://"
        },
        configuration: "ቅንብር",
        actionLinkHint: "ተጠቃሚዎች ማሳወቂያውን ሲጫኑ ወደዚህ ይመራሉ።",
        urgentHint: "ማሳወቂያውን በቀይ ያሳያል እና ከላይ ያስቀምጣል።",
        resetFields: "መስኮችን አጽዳ",
        broadcasting: "በመላክ ላይ...",
        sendBroadcast: "ማስታወቂያ ላክ"
      },
      deleteDialog: {
        title: "ማሳወቂያ ሰርዝ",
        descriptionPrefix: "ይህ ማሳወቂያውን ከሙከራ ታሪክ ያስወግዳል።"
      }
    },
    dashboard: {
      overview: "የዳሽቦርድ አጠቃላይ እይታ",
      totalPot: "ጠቅላላ ገንዘብ",
      claimedTickets: "የተያዙ ቲኬቶች",
      totalMembers: "ጠቅላላ አባላት",
      pending: "ማረጋገጫ የሚጠብቁ",
      cycle: "የአሁኑ ዙር",
      cycleTitle: "የዙር አስተዳደር",
      cycleDesc: "የአሁኑን የሎተሪ ዙር ሁኔታ ይቆጣጠሩ",
      active: "ንቁ",
      startNew: "አዲስ ዙር ጀምር",
      nextDraw: "ቀጣይ እጣ",
      daysRem: "ቀናት ቀርተዋል",
      recentPay: "የቅርብ ጊዜ የክፍያ ጥያቄዎች",
      viewAll: "ሁሉንም አሳይ",
      noPending: "ምንም በመጠባበቅ ላይ ያሉ ክፍያዎች የሉም።",
      user: "ተጠቃሚ",
      amount: "መጠን",
      date: "ቀን",
      action: "ተግባር",
      review: "ገምግም"
    },
    competition: {
      title: "የውድድር አስተዳደር",
      general: "አጠቃላይ ቅንብሮች",
      tickets: "ቲኬት አስተዳደር",
      drawSchedule: "የእጣ ፕሮግራም",
      setNextDraw: "ቀጣይ የእጣ ቀን ያዘጋጁ (በኢትዮጵያ አቆጣጠር)",
      preview: "ቅድመ እይታ",
      save: "ለውጦችን አስቀምጥ",
      currentPrize: "የአሁኑ ሽልማት",
      prizeName: "የሽልማት ስም",
      prizeValue: "የሽልማት ዋጋ",
      prizeImages: "የሽልማት ምስሎች",
      liveStream: "የቀጥታ ስርጭት",
      liveStatus: "የቀጥታ ሁኔታ"
    },
    prizes: {
      title: "ሽልማት አስተዳደር",
      liveAnnouncer: "የቀጥታ እጣ አወጣጥ",
      liveDesc: "ይህንን መሳሪያ በቀጥታ ስርጭት ወቅት አሸናፊውን ለተጠቃሚዎች ለማሳወቅ ይጠቀሙበት።",
      winTicket: "አሸናፊ የቲኬት ቁጥር",
      verify: "ቲኬት አረጋግጥ",
      announce: "አሸናፊውን አብስር",
      hallOfFame: "የዝና አዳራሽ (ያለፉት አሸናፊዎች)",
      hallDesc: "በሽልማት ገጹ ላይ የሚታዩትን የአሸናፊዎች ዝርዝር ያስተዳድሩ።",
      addWinner: "ያለፈ አሸናፊ ጨምር"
    },
    users: {
      title: "ተጠቃሚ አስተዳደር",
      addNew: "አዲስ ተጠቃሚ ጨምር",
      search: "በስም ወይም ስልክ ይፈልጉ...",
      allStatus: "ሁሉም ሁኔታዎች",
      verified: "የተረጋገጠ",
      pending: "በመጠባበቅ ላይ",
      contrib: "መዋጮ",
      ticket: "ቲኬት #",
      actions: "ተግባራት",
      showing: "በማሳየት ላይ",
      total: "ጠቅላላ ተጠቃሚዎች",
      status: "ሁኔታ",
      phone: "ስልክ"
    },
    payments: {
      title: "ክፍያ ማረጋገጫ",
      allCaughtUp: "ሁሉም ተጠናቋል!",
      noRequests: "በአሁኑ ሰዓት ማረጋገጫ የሚጠብቅ ክፍያ የለም።",
      amount: "የተገለጸው መጠን",
      reject: "ውድቅ አድርግ",
      approve: "አረጋግጥ"
    },
    settings: {
      title: "የመተግበሪያ ቅንብሮች",
      general: "አጠቃላይ ምርጫዎች",
      langTitle: "የአድሚን ቋንቋ",
      langDesc: "የአድሚን ዳሽቦርድ ቋንቋ ይቀይሩ።",
      security: "መለያ እና ደህንነት",
      userReg: "ተጠቃሚ ምዝገባ",
      userRegDesc: "አዳዲስ ተጠቃሚዎች መለያ እንዲፈጥሩ ፍቀድ",
      changePass: "የአድሚን የይለፍ ቃል ቀይር",
      update: "አዘምን",
      save: "ለውጦችን አስቀምጥ"
    },
    login: {
      title: "አድሚን ፓነል",
      label: "የይለፍ ቃል",
      btn: "ግባ",
      back: "ወደ ጣቢያው ተመለስ",
      placeholder: "የይለፍ ቃል ያስገቡ",
      failed: "መግባት አልተሳካም",
      failedMsg: "ያስገቡት የይለፍ ቃል ትክክል አይደለም።"
    }
  }
};


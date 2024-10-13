"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfile = exports.jobCategorizationPrompt = void 0;
exports.jobCategorizationPrompt = `
You are an assistant categorizing job ads for a user based on their personal preferences. Rank the following job ad from "Great" to "Bad" based on these criteria:

- **Job simplicity and requirements**: Jobs with fewer requirements and lower difficulty are preferred.
- **Technologies required**: Jobs that closely match the user’s technology skills are prioritized.
- **Contract type**: Unbefristet (permanent) contracts are favored over befristet (temporary).
- **Posting recency**: More recent job postings are generally better.
- **Individual user profile**: Tailor the ranking to the user’s personal profile (experience, skills, desired job type).
- **Distance to job location**: Prefer closer locations to reduce commute time.

**Job Ad Details**: __JOBADS_PLACEHOLDER__

**User Profile**: __USERPROFILE_PLACEHOLDER__

**Categorization**: Based on the above details, rank this job ad as one of the following:
1. Great
2. Good
3. Average
4. Bad

Please explain the rationale for your categorization in 2-3 sentences, considering the ease of the job, the technology match, the contract type, and the posting recency.
`;
exports.userProfile = `
- **Name**: Yassir Elkhaili
- **Role**: Full Stack Developer
- **Experience**: Skilled in both front-end and back-end development with a focus on TypeScript, PHP, Laravel, React, and web development frameworks. Open to a variety of roles, whether frontend, backend, or full-stack.
- **Desired Job Type**: Open to all types of development jobs, with a focus on web development. Prefers roles that are straightforward with clearly defined tasks.
- **Preferred Technologies**: Strong preference for TypeScript, PHP, Laravel, ReactJS, and TailwindCSS, but willing to explore other web development technologies.
- **Contract Preference**: Open to various job types, with a slight preference for unbefristet (permanent) contracts.
- **Location**: Based in Bremen, Germany, with a slight preference for local jobs in Bremen to minimize commute.
- **Additional Preferences**: Values jobs that are simpler and involve web development tasks. Prefers roles where skills in full-stack development can be applied effectively, especially for building scalable web solutions.
`;

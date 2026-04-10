import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Seeds the "Classic Professional" prebuilt template with a complete,
 * production-quality Jake's Resume style LaTeX document.
 *
 * The template uses only packages available in texlive-latex-base +
 * texlive-latex-extra (titlesec, enumitem) — no exotic dependencies.
 *
 * Field values stored in fieldValues JSON are interpolated at compile
 * time, never mutating the stored latexSource. This lets users reset
 * to the original structure at any time.
 */
export class SeedClassicResumeTemplate1741325505000
    implements MigrationInterface {
    name = 'SeedClassicResumeTemplate1741325505000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const latex = CLASSIC_PROFESSIONAL_TEMPLATE;

        const placeholders = [
            'name', 'phone', 'email', 'linkedin', 'github',
            'university', 'university_location', 'degree', 'graduation_year',
            'school', 'school_location', 'school_qualification', 'school_year',
            'job1_title', 'job1_dates', 'job1_company', 'job1_location',
            'job1_point1', 'job1_point2', 'job1_point3',
            'project1_name', 'project1_tech', 'project1_dates',
            'project1_point1', 'project1_point2',
            'project2_name', 'project2_tech', 'project2_dates',
            'project2_point1', 'project2_point2',
            'languages', 'frameworks', 'databases', 'tools',
        ];

        await queryRunner.query(
            `UPDATE \`templates\`
             SET   \`latex_source\` = ?,
                   \`placeholders\` = ?
             WHERE \`name\` = 'Classic Professional'
               AND \`kind\` = 'prebuilt'`,
            [latex, JSON.stringify(placeholders)],
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `UPDATE \`templates\`
             SET   \`latex_source\` = NULL,
                   \`placeholders\` = NULL
             WHERE \`name\` = 'Classic Professional'
               AND \`kind\` = 'prebuilt'`,
        );
    }
}

// ─── Template ──────────────────────────────────────────────────────────────
// Jake's Resume style (MIT) — modified for Ezra.
// Demo values are pre-filled so the template compiles out of the box.
// Users override them via the Form Editor (fieldValues) without touching
// the underlying LaTeX structure.

const CLASSIC_PROFESSIONAL_TEMPLATE = String.raw`%-------------------------
% Ezra — Classic Professional Resume
% Based on Jake's Resume (MIT License)
%-------------------------
\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\input{glyphtounicode}

%------------------ Page style ------------------
\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

%------------------ Margins ---------------------
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-0.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

%------------------ Section formatting ----------
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule\vspace{-5pt}]

\pdfgentounicode=1

%------------------ Custom commands -------------
\newcommand{\resumeItem}[1]{
  \item\small{#1 \vspace{-2pt}}
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
  \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
    \textbf{#1} & #2 \\
    \textit{\small#3} & \textit{\small #4} \\
  \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
  \item
  \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
    \small#1 & #2 \\
  \end{tabular*}\vspace{-7pt}
}

\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

%=================================================
\begin{document}

%------------ HEADING ----------------------------
\begin{center}
  \textbf{\Huge\scshape {{name}}} \\ \vspace{1pt}
  \small {{phone}} $|$
  \href{mailto:{{email}}}{\underline{{{email}}}} $|$
  \href{https://linkedin.com/in/{{linkedin}}}{\underline{linkedin.com/in/{{linkedin}}}} $|$
  \href{https://github.com/{{github}}}{\underline{github.com/{{github}}}}
\end{center}

%------------ EDUCATION --------------------------
\section{Education}
\resumeSubHeadingListStart
  \resumeSubheading
    {{{university}}}{{{university_location}}}
    {{{degree}}}{{{graduation_year}}}
  \resumeSubheading
    {{{school}}}{{{school_location}}}
    {{{school_qualification}}}{{{school_year}}}
\resumeSubHeadingListEnd

%------------ EXPERIENCE -------------------------
\section{Experience}
\resumeSubHeadingListStart
  \resumeSubheading
    {{{job1_title}}}{{{job1_dates}}}
    {{{job1_company}}}{{{job1_location}}}
    \resumeItemListStart
      \resumeItem{{{job1_point1}}}
      \resumeItem{{{job1_point2}}}
      \resumeItem{{{job1_point3}}}
    \resumeItemListEnd
\resumeSubHeadingListEnd

%------------ PROJECTS ---------------------------
\section{Projects}
\resumeSubHeadingListStart
  \resumeProjectHeading
    {\textbf{{{project1_name}}} $|$ \emph{{{project1_tech}}}}{{{project1_dates}}}
    \resumeItemListStart
      \resumeItem{{{project1_point1}}}
      \resumeItem{{{project1_point2}}}
    \resumeItemListEnd
  \resumeProjectHeading
    {\textbf{{{project2_name}}} $|$ \emph{{{project2_tech}}}}{{{project2_dates}}}
    \resumeItemListStart
      \resumeItem{{{project2_point1}}}
      \resumeItem{{{project2_point2}}}
    \resumeItemListEnd
\resumeSubHeadingListEnd

%------------ TECHNICAL SKILLS ------------------
\section{Technical Skills}
\begin{itemize}[leftmargin=0.15in, label={}]
  \small{\item{
    \textbf{Languages:}  {{languages}}  \\
    \textbf{Frameworks:} {{frameworks}} \\
    \textbf{Databases:}  {{databases}}  \\
    \textbf{Tools:}      {{tools}}
  }}
\end{itemize}

\end{document}
`;

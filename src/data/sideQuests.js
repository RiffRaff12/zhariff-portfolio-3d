export const SIDE_QUESTS = [
  {
    id: 'hifz-tracker',
    title: 'Hifz Tracker',
    subtitle: 'A Quran memorisation companion app',
    year: '2023',
    status: 'Live — personal use + small community',
    color: '#00b4d8',
    panels: [
      {
        type: 'intro',
        caption: 'Built it because nothing else did the job.',
        body: 'I was memorising the Quran and none of the tracking apps worked the way memorisation actually works. So I designed and built one that does.',
      },
      {
        type: 'problem',
        caption: 'THE PROBLEM',
        body: 'Hifz is non-linear. You revise old pages while learning new ones, and your revision schedule should adapt to your retention. Existing apps treated it like a linear progress bar. It isn\'t.',
      },
      {
        type: 'process',
        caption: 'THE BUILD',
        body: 'Designed in Figma, built in React Native. Implemented a spaced-repetition algorithm adapted for Quranic verses. Full offline support — no internet required mid-session. Ships to iOS and Android.',
      },
      {
        type: 'outcome',
        caption: 'WHERE IT IS NOW',
        body: 'I use it daily. A small community found it through word of mouth. No marketing — just a tool that works, shared among people who needed it.',
      },
    ],
  },
  {
    id: 'property-saas',
    title: 'Property Investment SaaS',
    subtitle: 'Deal analysis and portfolio tracking for Malaysian property investors',
    year: '2024',
    status: 'In development — early access',
    color: '#00b894',
    panels: [
      {
        type: 'intro',
        caption: 'The spreadsheet that refused to stay a spreadsheet.',
        body: 'I started investing in property. The analysis workflow was brutal — scattered across spreadsheets, PDFs, and mental maths. I\'m fixing that.',
      },
      {
        type: 'problem',
        caption: 'THE PROBLEM',
        body: 'Property investment analysis in Malaysia is fragmented. Financing calculators, rental yield models, capital gains projections, legal costs — all done separately. Serious investors have elaborate spreadsheets. Beginners have nothing.',
      },
      {
        type: 'process',
        caption: 'THE BUILD',
        body: 'Designed the full product in Figma. Currently building in React + Supabase. Core flow: paste a listing, the tool scrapes key data, you model the deal in under 3 minutes. Portfolio view tracks all properties and surfaces underperformers.',
      },
      {
        type: 'outcome',
        caption: 'WHERE IT IS NOW',
        body: 'Early access with a waiting list. This one started as a side quest. I suspect it\'ll turn into something larger.',
      },
    ],
  },
]

export const muiDataTableOptions = {
    filterType: 'dropdown',
    serverSide: true,
    selectableRowsHideCheckboxes: true
};

export const STUDENT_CLASS = [
    {name: 'five', title: 'পঞ্চম'},
    {name: 'six', title: 'ষষ্ঠ'},
    {name: 'seven', title: 'সপ্তম'},
    {name: 'eight', title: 'অষ্টম'},
    {name: 'nine', title: 'নবম'},
    {name: 'ten', title: 'দশম'},
    {name: 'eleven', title: 'একাদশ'},
    {name: 'twelve', title: 'দ্বাদশ'},
]

export const EDUCATION_MEDIUM = [
    {name: 'bangla', title: 'বাংলা'},
    {name: 'english', title: 'ইংরেজী'},
]

export const PARENTS_TYPE = [
    {name: 'father', title: 'বাবা'},
    {name: 'mother', title: 'মা'},
    {name: 'both', title: 'উভয়ই'},
    {name: 'other', title: 'অন্য কেউ'},
]

export const DEVICE_TYPES = [
    'Phone [Have option to attach additional camera ]',
    'Phone [Do not have any option to attach additional camera ]',
    'Tablet [Have option to attach additional camera ]',
    'Tablet [Do not have any option to attach additional camera ]',
    'Desktop',
    'Laptop',
    'Single board PC',
    'Other [Have option to attach additional camera ]',
    'Other [Do not have any option to attach additional camera ]',
]

export const AVAILABLE_COURSES = [
    {name: 'CCAP [Cadet College Admission Program]', title: 'CCAP [Cadet College Admission Program]'},
    {name: 'Class Seven [Academic Program]', title: 'Class Seven [Academic Program]'},
    {name: 'Class Eight [Academic Program]', title: 'Class Eight [Academic Program]'},
    {name: 'Class Nine [Academic Program]', title: 'Class Nine [Academic Program]'},
    {name: 'Class Ten [Academic Program]', title: 'Class Ten [Academic Program]'},
    {name: 'ANI [SSC Examinee]', title: 'ANI [SSC Examinee]'},
    {name: 'HSC 01', title: 'HSC 01'},
    {name: 'HSC 02', title: 'HSC 02'},
]

export const CO_CURRICULAR_ACTIVITIES = [
    'Chess',
    '16 Beads [ষোল গুটি]',
    'Story writing',
    'গল্প লেখা',
    'Drawings',
    'Debate',
    'Extempore Speech',
    'Assignment Compettion',
    'Digital Art',
]

export const MOBILE_NUMBER_REGEX = new RegExp('^(?:\\+88|88)?(01[3-9]\\d{8})$');
export const EMAIL_REGEX = new RegExp(
    '(<|^)[a-z\\d.]+([a-z\\d.\\s_-]{0,30})+@(?:[a-z\\d]+\\.)+([a-z]{2,})(>|$)',
);
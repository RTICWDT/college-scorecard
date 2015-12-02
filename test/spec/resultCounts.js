exports.resultCounts = {
  'allSchools' : '3,587',
  'allColumbia' : '22',
  'allStartsWithColumbia' : '13', // CLARIFICATION: plan says 15, there are 13 on page 1
  'allCol' : '1,780',
  'allInDelaware' : '11',
  'allInDelawareKentucky' : '57',
  'allInFarWest' : '458',
  'allIn10023NoRadius' : '1',
  'allIn10023Radius5' : '43',
  'checkIncludeOnlineOnly' : '31',
  'allSmall' : '2,029',
  'allMedium' : '1,329',
  'allLarge' : '229',
  'allSmallAndLarge' : '2,258',
  'allAssociates' : '1,488',
  'allBachelors' : '2,099',
  'allPublic' : '1,368',
  'allPrivateNonProfit' : '1,402',
  'allPrivateForProfit' : '817'
};

exports.allSchoolsInState = [
  {'code': 'AL', 'name': 'Alabama', 'count': '63'},
  {'code': 'AK', 'name': 'Alaska', 'count': '5'},
  {'code': 'AZ', 'name': 'Arizona', 'count': '49'},
  {'code': 'AR', 'name': 'Arkansas', 'count': '32'},
  {'code': 'CA', 'name': 'California', 'count': '307'},
  {'code': 'CO', 'name': 'Colorado', 'count': '60'},
  {'code': 'CT', 'name': 'Connecticut', 'count': '40'},
  {'code': 'DE', 'name': 'Delaware', 'count': '11'},
  {'code': 'DC', 'name': 'District of Columbia', 'count': '13'},
  {'code': 'FL', 'name': 'Florida', 'count': '157'},
  {'code': 'GA', 'name': 'Georgia', 'count': '88'},
  {'code': 'HI', 'name': 'Hawaii', 'count': '17'},
  {'code': 'ID', 'name': 'Idaho', 'count': '18'},
  {'code': 'IL', 'name': 'Illinois', 'count': '131'},
  {'code': 'IN', 'name': 'Indiana', 'count': '73'},
  {'code': 'IA', 'name': 'Iowa', 'count': '58'},
  {'code': 'KS', 'name': 'Kansas', 'count': '50'},
  {'code': 'KY', 'name': 'Kentucky', 'count': '46'},
  {'code': 'LA', 'name': 'Louisiana', 'count': '42'},
  {'code': 'ME', 'name': 'Maine', 'count': '27'},
  {'code': 'MD', 'name': 'Maryland', 'count': '52'},
  {'code': 'MA', 'name': 'Massachusetts', 'count': '107'},
  {'code': 'MI', 'name': 'Michigan', 'count': '97'},
  {'code': 'MN', 'name': 'Minnesota', 'count': '93'},
  {'code': 'MS', 'name': 'Mississippi', 'count': '37'},
  {'code': 'MO', 'name': 'Missouri', 'count': '94'},
  {'code': 'MT', 'name': 'Montana', 'count': '22'},
  {'code': 'NE', 'name': 'Nebraska', 'count': '37'},
  {'code': 'NV', 'name': 'Nevada', 'count': '19'},
  {'code': 'NH', 'name': 'New Hampshire', 'count': '23'},
  {'code': 'NJ', 'name': 'New Jersey', 'count': '64'},
  {'code': 'NM', 'name': 'New Mexico', 'count': '30'},
  {'code': 'NY', 'name': 'New York', 'count': '263'},
  {'code': 'NC', 'name': 'North Carolina', 'count': '124'},
  {'code': 'ND', 'name': 'North Dakota', 'count': '19'},
  {'code': 'OH', 'name': 'Ohio', 'count': '179'},
  {'code': 'OK', 'name': 'Oklahoma', 'count': '53'},
  {'code': 'OR', 'name': 'Oregon', 'count': '48'},
  {'code': 'PA', 'name': 'Pennsylvania', 'count': '199'},
  {'code': 'RI', 'name': 'Rhode Island', 'count': '12'},
  {'code': 'SC', 'name': 'South Carolina', 'count': '60'},
  {'code': 'SD', 'name': 'South Dakota', 'count': '24'},
  {'code': 'TN', 'name': 'Tennessee', 'count': '79'},
  {'code': 'TX', 'name': 'Texas', 'count': '178'},
  {'code': 'UT', 'name': 'Utah', 'count': '34'},
  {'code': 'VT', 'name': 'Vermont', 'count': '21'},
  {'code': 'VA', 'name': 'Virginia', 'count': '91'},
  {'code': 'WA', 'name': 'Washington', 'count': '62'},
  {'code': 'WV', 'name': 'West Virginia', 'count': '37'},
  {'code': 'WI', 'name': 'Wisconsin', 'count': '61'},
  {'code': 'WY', 'name': 'Wyoming', 'count': '9'},
  {'code': 'AS', 'name': 'American Samoa', 'count': '1'},
  //{'code': 'FM', 'name': 'Federated States of Micronesia', 'count': '1'},
  {'code': 'GU', 'name': 'Guam', 'count': '3'},
  //{'code': 'MP', 'name': 'Northern Mariana Islands', 'count': '1'},
  //{'code': 'PW', 'name': 'Palau', 'count': '1'},
  {'code': 'PR', 'name': 'Puerto Rico', 'count': '63'},
  {'code': 'VI', 'name': 'Virgin Islands', 'count': '1'}
  ];

exports.allSchoolsInRegion = [
  {'code': '1', 'name': 'New England', 'count': '230'},
  {'code': '2', 'name': 'Mid-Atlantic', 'count': '601'}, // CLARIFICATION: test calls this 'Mid Atlantic'
  {'code': '3', 'name': 'Great Lakes', 'count': '541'},
  {'code': '4', 'name': 'Plains', 'count': '375'},
  {'code': '5', 'name': 'Southeast', 'count': '856'},
  {'code': '6', 'name': 'Southwest', 'count': '310'},
  {'code': '7', 'name': 'Rocky Mountains', 'count': '143'},
  {'code': '8', 'name': 'Far West', 'count': '458'},
  {'code': '9', 'name': 'Outlying areas', 'count': '72'} // CLARIFICATION: plan calls this 'Outlying Areas'
];

exports.allSchoolsWithProgram = [
  {'name' : 'Agriculture, Agriculture Operations, and Related Sciences', 'count': '539'}, // CLAR: 492
  {'name' : 'Natural Resources and Conservation', 'count': '969'}, // CLAR: 803
  {'name' : 'Architecture and Related Services', 'count': '322'}, // CLAR: 268
  {'name' : 'Area, Ethnic, Cultural, Gender, and Group Studies', 'count': '737'}, // CLAR: 579
  {'name' : 'Communication, Journalism, and Related Programs', 'count': '1,559'}, // CLAR: 1456
  {'name' : 'Communications Technologies/Technicians and Support Services', 'count': '582'}, // CLAR: 501
  {'name' : 'Computer and Information Sciences and Support Services', 'count': '2,550'}, // CLAR: 2398
  {'name' : 'Personal and Culinary Services', 'count': '570'}, // CLAR: 530
  {'name' : 'Education', 'count': '2,165'}, // CLAR: 1823
  {'name' : 'Engineering', 'count': '949'}, // CLAR: 830
  {'name' : 'Engineering Technologies and Engineering-Related Fields', 'count': '1,321'}, // CLAR: 1183
  {'name' : 'Foreign Languages, Literatures, and Linguistics', 'count': '1,238'}, // CLAR: 1113
  {'name' : 'Family and Consumer Sciences/Human Sciences', 'count': '948'}, // CLAR: 845
  {'name' : 'Legal Professions and Studies', 'count': '1,113'}, // CLAR: 844
  {'name' : 'English Language and Literature/Letters', 'count': '1,585'}, // CLAR: 1498
  {'name' : 'Liberal Arts and Sciences, General Studies and Humanities', 'count': '2,000'}, // CLAR: 1822
  {'name' : 'Library Science', 'count': '129'}, // CLAR: 44
  {'name' : 'Biological and Biomedical Sciences', 'count': '1,678'}, // CLAR: 1614
  {'name' : 'Mathematics and Statistics', 'count': '1,479'}, // CLAR: 1374
  {'name' : 'Military Technologies and Applied Sciences', 'count': '21'}, // CLAR: 11
  {'name' : 'Multi/Interdisciplinary Studies', 'count': '1,495'}, // CLAR: 1218
  {'name' : 'Parks, Recreation, Leisure, and Fitness Studies', 'count': '1,214'}, // CLAR: 1105
  {'name' : 'Philosophy and Religious Studies', 'count': '1,099'}, // CLAR: 976
  {'name' : 'Theology and Religious Vocations', 'count': '549'}, // CLAR: 422
  {'name' : 'Physical Sciences', 'count': '1,396'}, // CLAR: 1298
  {'name' : 'Science Technologies/Technicians', 'count': '210'}, // CLAR: 160
  {'name' : 'Psychology', 'count': '1,672'}, // CLAR: 1629
  {'name' : 'Homeland Security, Law Enforcement, Firefighting and Related Protective Services', 'count': '1,936'}, // CLAR: 1810
  {'name' : 'Public Administration and Social Service Professions', 'count': '1,309'}, // CLAR: 1084
  {'name' : 'Social Sciences', 'count': '1,601'}, // CLAR: 1506
  {'name' : 'Construction Trades', 'count': '427'}, // CLAR: 369
  {'name' : 'Mechanic and Repair Technologies/Technicians', 'count': '626'}, // CLAR: 589
  {'name' : 'Precision Production', 'count': '455'}, // CLAR: 429
  {'name' : 'Transportation and Materials Moving', 'count': '251'}, // CLAR: 205
  {'name' : 'Visual and Performing Arts', 'count': '2,205'}, // CLAR: 2117
  {'name' : 'Health Professions and Related Programs', 'count': '2,722'}, // CLAR: 2521
  {'name' : 'Business, Management, Marketing, and Related Support Services', 'count': '3,015'}, // CLAR: 2914
  {'name' : 'History', 'count': '1,394'} // CLAR: 1345
];

exports.specialDesignation = [
  {'name' : 'Women-Only', 'count' : '43'},
  {'name' : 'Men-Only', 'count' : '59'},
  {'name' : 'Asian American and Native American Pacific Islander-Serving Institution', 'count' : '12'},
  {'name' : 'Alaska Native and Native Hawaiian-Serving Institution', 'count' : '8'},
  {'name' : 'Hispanic-Serving Institution', 'count' : '118'},
  {'name' : 'Historically Black College and University', 'count' : '92'},
  {'name' : 'Native American Non-Tribal Institution', 'count' : '13'},
  {'name' : 'Predominantly Black Institution', 'count' : '18'},
  {'name' : 'Tribal College and University', 'count' : '29'}
];

exports.religiousAffiliation = [
  {'code' : '51', 'name' : 'African Methodist Episcopal', 'count' : '5'},
  {'code' : '24', 'name' : 'African Methodist Episcopal Zion Church', 'count' : '2'},
  {'code' : '52', 'name' : 'American Baptist', 'count' : '13'},
  {'code' : '22', 'name' : 'American Evangelical Lutheran Church', 'count' : '1'},
  {'code' : '53', 'name' : 'American Lutheran', 'count' : '0'},
  {'code' : '27', 'name' : 'Assemblies of God Church', 'count' : '13'},
  {'code' : '54', 'name' : 'Baptist', 'count' : '63'},
  {'code' : '28', 'name' : 'Brethren Church', 'count' : '2'},
  {'code' : '34', 'name' : 'Christ and Missionary Alliance Church', 'count' : '4'},
  {'code' : '61', 'name' : 'Christian Church (Disciples of Christ)', 'count' : '13'},
  {'code' : '48', 'name' : 'Christian Churches and Churches of Christ', 'count' : '17'},
  {'code' : '55', 'name' : 'Christian Methodist Episcopal', 'count' : '3'},
  {'code' : '35', 'name' : 'Christian Reformed Church', 'count' : '2'},
  {'code' : '58', 'name' : 'Church of Brethren', 'count' : '5'},
  {'code' : '57', 'name' : 'Church of God', 'count' : '8'},
  {'code' : '59', 'name' : 'Church of the Nazarene', 'count' : '9'},
  {'code' : '74', 'name' : 'Churches of Christ', 'count' : '17'},
  {'code' : '60', 'name' : 'Cumberland Presbyterian', 'count' : '1'},
  {'code' : '101', 'name' : 'Ecumenical Christian', 'count' : '0'},
  {'code' : '50', 'name' : 'Episcopal Church, Reformed', 'count' : '1'},
  {'code' : '102', 'name' : 'Evangelical Christian', 'count' : '1'},
  {'code' : '36', 'name' : 'Evangelical Congregational Church', 'count' : '0'},
  {'code' : '37', 'name' : 'Evangelical Covenant Church of America', 'count' : '1'},
  {'code' : '38', 'name' : 'Evangelical Free Church of America', 'count' : '2'},
  {'code' : '39', 'name' : 'Evangelical Lutheran Church', 'count' : '23'},
  {'code' : '64', 'name' : 'Free Methodist', 'count' : '5'},
  {'code' : '41', 'name' : 'Free Will Baptist Church', 'count' : '3'},
  {'code' : '65', 'name' : 'Friends', 'count' : '7'},
  {'code' : '91', 'name' : 'Greek Orthodox', 'count' : '1'},
  {'code' : '42', 'name' : 'Interdenominational', 'count' : '25'},
  {'code' : '40', 'name' : 'International United Pentecostal Church', 'count' : '0'},
  {'code' : '80', 'name' : 'Jewish', 'count' : '26'},
  {'code' : '94', 'name' : 'Latter Day Saints (Mormon Church)', 'count' : '4'},
  {'code' : '68', 'name' : 'Lutheran Church - Missouri Synod', 'count' : '9'},
  {'code' : '67', 'name' : 'Lutheran Church in America', 'count' : '3'},
  {'code' : '43', 'name' : 'Mennonite Brethren Church', 'count' : '2'},
  {'code' : '69', 'name' : 'Mennonite Church', 'count' : '5'},
  {'code' : '87', 'name' : 'Missionary Church Inc', 'count' : '1'},
  {'code' : '44', 'name' : 'Moravian Church', 'count' : '2'},
  {'code' : '78', 'name' : 'Multiple Protestant Denomination', 'count' : '3'},
  {'code' : '45', 'name' : 'North American Baptist', 'count' : '0'},
  {'code' : '100', 'name' : 'Original Free Will Baptist', 'count' : '1'},
  {'code' : '79', 'name' : 'Other Protestant', 'count' : '17'},
  {'code' : '47', 'name' : 'Pentecostal Holiness Church', 'count' : '2'},
  {'code' : '103', 'name' : 'Presbyterian', 'count' : '2'},
  {'code' : '66', 'name' : 'Presbyterian Church (USA)', 'count' : '49'},
  {'code' : '73', 'name' : 'Protestant Episcopal', 'count' : '3'},
  {'code' : '77', 'name' : 'Protestant, not specified', 'count' : '0'},
  {'code' : '49', 'name' : 'Reformed Church in America', 'count' : '3'},
  {'code' : '81', 'name' : 'Reformed Presbyterian Church', 'count' : '2'},
  {'code' : '30', 'name' : 'Roman Catholic', 'count' : '219'},
  {'code' : '92', 'name' : 'Russian Orthodox', 'count' : '0'},
  {'code' : '95', 'name' : 'Seventh Day Adventists', 'count' : '13'},
  {'code' : '75', 'name' : 'Southern Baptist', 'count' : '22'},
  {'code' : '97', 'name' : 'The Presbyterian Church in America', 'count' : '1'},
  {'code' : '88', 'name' : 'Undenominational', 'count' : '14'},
  {'code' : '93', 'name' : 'Unitarian Universalist', 'count' : '0'},
  {'code' : '84', 'name' : 'United Brethren Church', 'count' : '1'},
  {'code' : '76', 'name' : 'United Church of Christ', 'count' : '10'},
  {'code' : '71', 'name' : 'United Methodist', 'count' : '86'},
  {'code' : '89', 'name' : 'Wesleyan', 'count' : '6'},
  {'code' : '33', 'name' : 'Wisconsin Evangelical Lutheran Synod', 'count' : '2'},
  {'code' : '99', 'name' : 'Other (none of the above)', 'count' : '8'}
];

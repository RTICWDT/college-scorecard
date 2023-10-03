import { fields, formMappings } from '../constants.js';
import { SiteData } from './SiteData.js';
import "~/js/filters.js"
import _ from 'lodash';

export default {
    mixins:[SiteData],
    computed: {
        fields() {
            return fields;
        },
        id() {
            console.log(this.school)
            if (!this.school) return null;
            return _.get(this.school, this.fields['ID']);
        },
        schoolName() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['NAME'], 'N/A');
        },
        city() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['CITY'], 'N/A')
        },
        state() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['STATE'], 'N/A')
        },
        zip() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['ZIP_CODE'], 'N/A');
        },        
        schoolUrlDisplay() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['SCHOOL_URL'], 'ed.gov')
        },
        underInvestigation() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['UNDER_INVESTIGATION']);
        },
        years() {
            if (!this.school) return null;
            return _.get(this.school, this.fields["PREDOMINANT_DEGREE"]);
        },
        awardLevels() {
            if (!this.school) return null;
            // return values are whether the institution offers other kind of degrees/certs than the predominant degree
            // if they do we return the glossary term key to display or false to disable the tooltip
            switch (this.years) {
                case 1:
                    return _.get(
                            this.school,
                            this.fields.DEGREE_OFFERED + ".assoc_or_bachelors"
                        ) ?
                        "certificate" :
                        false;
                case 2:
                    return _.get(
                            this.school,
                            this.fields.DEGREE_OFFERED + ".certificate"
                        ) || _.get(this.school, this.fields.DEGREE_OFFERED + ".bachelors") ?
                        "2-year" :
                        false;
                case 3:
                    return _.get(
                            this.school,
                            this.fields.DEGREE_OFFERED + ".certificate"
                        ) || _.get(this.school, this.fields.DEGREE_OFFERED + ".assoc") ?
                        "4-year" :
                        false;
            }
            return false;
        },
        netPrice() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['NET_PRICE'])
        },
        parentPlusDebt() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['PARENT_PLUS_TOTAL_DEBT'])
        },        
        parentPlusDebtAll() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['PARENT_PLUS_TOTAL_DEBT_ALL'])
        },    
        parentPlusPayment() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['PARENT_PLUS_LOAN_PAYMENT'])
        },        
        parentPlusPaymentAll() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['PARENT_PLUS_LOAN_PAYMENT_ALL'])
        }, 
        monthlyLoanPayment() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['MONTHLY_LOAN_PAYMENT'])
        },        
        monthlyLoanPaymentAll() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['MONTHLY_LOAN_PAYMENT'])
        },                        
        undergraduates() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['SIZE'])
        },
        publicPrivate() {
            if (!this.school) return null;
            var ownership = _.get(this.school, this.fields["OWNERSHIP"]);
            switch (+ownership) {
                case 1: // public
                    return "public";

                case 2: // private
                case 3:
                    return "private";
            }
            return null;
        },
        income() {
            if (!this.school) return null;
            let income = _.get(this.school, this.fields["NET_PRICE_BY_INCOME"]);
            return income[this.publicPrivate]["by_income_level"];
        },
        specialDesignations() {
            if (!this.school) return null;
            var designations = [];
            let SPECIAL_DESIGNATIONS = this.site.data.special_designations || {};

            if (+_.get(this.school, this.fields.WOMEN_ONLY)) {
                designations.push(SPECIAL_DESIGNATIONS.women_only);
            } else if (+_.get(this.school, this.fields.MEN_ONLY)) {
                designations.push(SPECIAL_DESIGNATIONS.men_only);
            }

            var religious = _.get(this.school, this.fields.RELIGIOUS);
            if (religious in this.RELIGIOUS_AFFILIATIONS_BY_NUMBER) {
                designations.push(this.RELIGIOUS_AFFILIATIONS_BY_NUMBER[religious]);
            }

            var minorityServing = _.get(this.school, this.fields.MINORITY_SERVING);
            if (minorityServing) {
                for (var key in SPECIAL_DESIGNATIONS) {
                    if (+minorityServing[key]) {
                        designations.push(SPECIAL_DESIGNATIONS[key]);
                    }
                }
            }
            return designations;
        },
        raceEthnicity() {
            if (!this.school) return null;
            let output = [];
            let re = _.get(this.school, this.fields["RACE_ETHNICITY"]);
            let re_staff = _.get(this.school, this.fields["RACE_ETHNICITY_STAFF"]);
            let include = [
                "aian",
                "asian",
                "black",
                "hispanic",
                "nhpi",
                "non_resident_alien",
                "two_or_more",
                "unknown",
                "white"
            ];
            for (let p = 0; p < include.length; p++) {
                var student_item = include[p];
                var faculty_item = include[p];

                if (include[p] == "non_resident_alien")
                    faculty_item = "nonresident";

                output.push({
                    label: this.site.data.race_ethnicity[include[p]],
                    value: re[student_item],
                    staff_value: re_staff[faculty_item]
                });
            }
            console.log(output)
            return _.sortBy(output, ["label"]);
        },
        retentionRate() {
            if (!this.school) return null;
            let retention = _.get(this.school, this.fields.RETENTION_RATE);
            if (retention) {
                let fourYear = retention.four_year.full_time_pooled;
                return fourYear || fourYear === 0 ?
                    fourYear :
                    retention.lt_four_year.full_time_pooled;
            }
            retention = _.get(
                this.school,
                this.fields.RETENTION_RATE + ".four_year.full_time_pooled"
            );
            return retention || retention === 0 ?
                retention :
                _.get(
                    this.school,
                    this.fields.RETENTION_RATE + ".lt_four_year.full_time_pooled"
                );
        },
        completionRate() {
            if (!this.school) return null;
            let OM = _.get(this.school, this.fields.COMPLETION_OM);
            let G150_4 = _.get(this.school, this.fields.COMPLETION_150_4);
            let G150_LT4 = _.get(this.school, this.fields.COMPLETION_150_LT4);
            if (!OM && !G150_4 && !G150_LT4) {
                return false;
            } else if (OM) {
                return OM;
            } else {
                return this.years == 3 ? G150_4 : G150_LT4;
            }
        },
        completionRatePell() {
            if (!this.school) return null;
            let OM = _.get(this.school, this.fields.COMPLETION_OM_PELL);
            let G150_4 = _.get(this.school, this.fields.COMPLETION_150_4_PELL);
            let G150_LT4 = _.get(this.school, this.fields.COMPLETION_150_LT4_PELL);

            if (!OM && !G150_4 && !G150_LT4) {
                return false;
            } else if (OM) {
                return OM;
            } else {
                return this.years == 3 ? G150_4 : G150_LT4;

            }
        },        
        completionRateFieldDefinition(){
            if (!this.school) return null;
            let OM = _.get(this.school, this.fields.COMPLETION_OM);
            return (OM)?'default':'gr150';
        },
        completionRateOverall(){
            if (!this.school) return null;
            return _.get(this.school, this.fields.COMPLETION_RATE)
        },
        programReporter() {
            if (!this.school) return null;
            let reporterData = [];
            let programs = _.get(this.school, this.fields.PROGRAM_REPORTER_PROGRAM);
            let cost = _.get(this.school, this.fields.PROGRAM_REPORTER_COST);
            for (let q = 1; q <= 6; q++) {
                if (programs["program_" + q].cip_6_digit.code) {
                    reporterData.push({
                        ...programs["program_" + q].cip_6_digit,
                        ...cost["program_" + q].cip_6_digit
                    });
                }
            }
            return reporterData;
        },
        isProgramReporter() {
            if (!this.school) return null;
            return _.get(this.school, this.fields.PROGRAM_REPORTER_OFFERED) > 0;
        },
        isBranch() {
            if (!this.school) return null;
            // 0 not main
            // 1 main
            return _.get(this.school, this.fields["MAIN"]) === 0;
        },
        schoolUrl() {
            if (!this.school) return null;
            let url = _.get(this.school, this.fields['SCHOOL_URL'], '#');
            if (url == '#') return false;
            else if (url.match(/^http/)) return url;
            else return 'http://' + url;
        },

        fullTimeEnrollment() {
            if (!this.school) return null;
            let fte = _.get(this.school, this.fields['PART_TIME_SHARE']);  
            if (fte == null) return null;
            return (1 - fte).toFixed(2);
        },
        partTimeEnrollment() {
            if (!this.school) return null;
            let pte = _.get(this.school, this.fields['PART_TIME_SHARE']);
            if (pte == null) return null;
            return pte.toFixed(2);
        },
        socioEconomicDiversity() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['PELL_PERCENTAGE']);
        },
        studentRatio() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['STUDENT_RATIO']);
        },          
        netPriceCalculatorUrl() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['NET_PRICE_CALC_URL'], '#');
        },
        allFieldsOfStudy() {
            if (!this.school) return null;
            let fos = _.get(this.school, this.fields['FIELD_OF_STUDY']);
            if(!fos) return null;

            // Fix data issue where the apostrophe is dropped in bachelor's degree
            if(!fos.length)
            {
                fos = [fos];
            }
            for(let i=0; i<fos.length; i++)
            {
                if(_.get(fos[i],'credential.level') === 3){
                    _.set(fos[i],'credential.title', "Bachelor's Degree");
                }
                
                // if(fos[i].credential.level==3)
                // {
                //     fos[i].credential.title="Bachelor's Degree";
                // }
            }
            return fos;
        },
        debtRange() {
            // TODO - This might need a refactor
            if (!this.allFieldsOfStudy) return null;

            return this.generateDebtRange(this.allFieldsOfStudy, this.aidShowMedianDebtWithPrior, this.aidLoanSelect);

            // let fos = this.allFieldsOfStudy;
            // if(!fos.length)
            // {
            //     fos = [fos];
            // }
            // let range = false;

            // let cleanDebt = fos.reduce((result, fieldOfStudy) => {
            //     if(fieldOfStudy.credential.level <= 3){
            //         let tempObject = {
            //             debt:null,
            //             title: fieldOfStudy.title,
            //             credential:{
            //                 title: fieldOfStudy.credential.title
            //             }
            //         }
            //
            //         if(this.aidShowMedianDebtWithPrior){
            //             if(this.aidLoanSelect === 'fed'){
            //                 tempObject.debt = _.get(fieldOfStudy, fields['FOS_DEBT_MEDIAN_PRIOR']);
            //                 tempObject.payment = _.get(fieldOfStudy, fields['FOS_DEBT_MONTHLY_PRIOR']);
            //             }else{
            //                 tempObject.debt = _.get(fieldOfStudy, fields['FOS_PP_DEBT_MEDIAN_PRIOR']);
            //                 tempObject.payment = _.get(fieldOfStudy, fields['FOS_PP_DEBT_MONTHLY_PRIOR']);
            //             }
            //         }else{
            //             if(this.aidLoanSelect === 'fed'){
            //                 tempObject.debt = _.get(fieldOfStudy, fields['FOS_DEBT_MEDIAN']);
            //                 tempObject.payment = _.get(fieldOfStudy, fields['FOS_DEBT_MONTHLY']);
            //             }else{
            //                 tempObject.debt = _.get(fieldOfStudy, fields['FOS_PP_DEBT_MEDIAN']);
            //                 tempObject.payment = _.get(fieldOfStudy, fields['FOS_PP_DEBT_MONTHLY']);
            //             }
            //         }
            //
            //         result.push(tempObject);
            //     }
            //
            //     return result;
            // },[]);

            // let cleanDebt = this.cleanDebt(fos, this.aidShowMedianDebtWithPrior, this.aidLoanSelect);
            //
            // let orderedDebt = cleanDebt.sort(
            //     (a, b) => a.debt - b.debt
            // );
            //
            // if(orderedDebt[0]==null)
            // {
            //     return null;
            // }
            // else
            // {
            //     return {
            //         single: orderedDebt.length == 1 || (orderedDebt[0].debt == orderedDebt[orderedDebt.length-1].debt),
            //         min: orderedDebt[0],
            //         max: orderedDebt[orderedDebt.length - 1]
            //     }
            // }
        },
        earningsRange() {
            if (!this.allFieldsOfStudy) return null;
            let fos = this.allFieldsOfStudy;
            if(!fos.length)
            {
                fos = [fos];
            }
            let cleanEarnings = fos.filter(
                obj => _.get(obj,'earnings.highest.2_yr.overall_median_earnings') && _.get(obj,'credential.level') <= 3
            );
            let orderedEarnings = cleanEarnings.sort(
                (a, b) => _.get(a,'earnings.highest.2_yr.overall_median_earnings') - _.get(b, 'earnings.highest.2_yr.overall_median_earnings')
            ).filter(x => x.earnings.highest["2_yr"].overall_median_earnings);
            if(orderedEarnings[0]==null)
            {
                return null;
            }
            else
            {
                return {
                    single: orderedEarnings.length == 1 || (orderedEarnings[0].earnings.highest['2_yr'].overall_median_earnings== orderedEarnings[orderedEarnings.length-1].earnings.highest['2_yr'].overall_median_earnings),
                    min: orderedEarnings[0],
                    max: orderedEarnings[orderedEarnings.length - 1]
                }
            }
        },
        act() {
            if (!this.school) return null;
            return {
                available: _.get(this.school, this.fields['ACT_MIDPOINT']) != null,
                lower: _.get(this.school, this.fields['ACT_25TH_PCTILE']),
                upper: _.get(this.school, this.fields['ACT_75TH_PCTILE']),
                min: 0,
                max: 36
            }
        },
        satReading() {
            if (!this.school) return null;
            return {
                available: _.get(this.school, this.fields['SAT_READING_MIDPOINT']) != null,
                lower: _.get(this.school, this.fields['SAT_READING_25TH_PCTILE']),
                upper: _.get(this.school, this.fields['SAT_READING_75TH_PCTILE']),
                min: 0,
                max: 800
            }
        },
        satMath() {
            if (!this.school) return null;
            return {
                available: _.get(this.school, this.fields['SAT_MATH_MIDPOINT']) != null,
                lower: _.get(this.school, this.fields['SAT_MATH_25TH_PCTILE']),
                upper: _.get(this.school, this.fields['SAT_MATH_75TH_PCTILE']),
                min: 0,
                max: 800
            }
        },
        acceptanceRate() {
            if (!this.school) return null;
            var retval = _.get(this.school, this.fields['ACCEPTANCE_RATE_CONSUMER']);
            return retval;
        },
        acceptanceRateActual() {
            if (!this.school) return null;
            var retval = _.get(this.school, this.fields['ACCEPTANCE_RATE']);
            return retval;
        },        
        openAdmissions() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['OPEN_ADMISSIONS'])
        },
        studentsReceivingLoans() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['AID_PERCENTAGE']);
        },
        aidFlag() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['AID_ELIGIBILITY'])
        },
        fieldsLink() {
            if (!this.school) return null;
            let id = _.get(this.school, this.fields["ID"]);
            let name = _.get(this.school, this.fields["NAME"], "(unknown)");
            return "/school/fields/?" + id + "-" + name.replace(/\W+/g, "-");
        },
        schoolLink() {
            if (!this.school) return null;
            let id = _.get(this.school, this.fields['ID']);
            let name = _.get(this.school, this.fields['NAME'], '(unknown)');
            return '/school/?' + id + '-' + name.replace(/\W+/g, '-');
        },
        estimatedParentBorrowedText(){
            if (!this.school ||
              _.get(this.school, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MIN']) === 'undefined' ||
              _.get(this.school, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MAX']) === 'undefined' ||
              _.get(this.school, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MIN']) === null ||
              _.get(this.school, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MAX']) === null
            ){
                return null;
            }

            return this.formatParentPlusText(
              _.get(this.school, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MIN']),
              _.get(this.school, fields['PARENT_PLUS_ESTIMATED_PARENT_BORROWED_MAX'])
            );
        },
        dolflag() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['DOLFLAG'])
        },
        repaymentRates()  {
            if (!this.school) return null;
            let output = {};
            output['ug'] = []
            output['ugcomp'] = []
            let types = ['ug','ugcomp']
            var rr = this.site.data.repayment_rates;
            let rates = _.get(this.school, this.fields['REPAYMENT_RATES']);
            let include = [
                "default",
                "deferment",
                "discharge",
                "fullypaid",
                "delinquent",
                "noprogress",
                "forbearance",
                "makingprogress"
            ];
            types.forEach(function (item, index) {
                for (let p = 0; p < include.length; p++) {
                    output[types[index]].push({
                        label: rr[include[p]],
                        value: rates[item][include[p]]
                    });
                }
            });
            var ret = {}
            ret['ug'] = this.orderByWithNullsAtEnd(output['ug'], "value", true)
            ret['ugcomp'] = this.orderByWithNullsAtEnd(output['ugcomp'], "value", true)
            //console.log(ret);
            return ret;           
        },       
        medianEarnings() {
            if (!this.school) return null;
            return _.get(this.school, fields['MEDIAN_EARNINGS']) 
        },
        federalDebt() {
            if (!this.school) return null;
            return _.get(this.school, fields['AVERAGE_TOTAL_DEBT']) 
        },
        toggleMedianEarnings() {
            if (!this.school) return null;
            var medians = 
                    { 0 : _.get(this.school, fields['EARNINGS_MIDPOINT_PRED_DEGREE']),
                     1 : _.get(this.school, fields['EARNINGS_MIDPOINT_ALL'])}
            return medians;
        },
        toggleAverageAnnualCost() {
            if (!this.school) return null;
            var medians = 
                    { 0 : _.get(this.school, fields['AVG_COST_MIDPOINT_PRED_DEGREE']),
                    1 : _.get(this.school, fields['AVG_COST_MIDPOINT_ALL'])}
            return medians;
        },      
        toggleGraduationRate() {
            if (!this.school) return null;
            var medians = 
                    { 0 : _.get(this.school, fields['COMPLETION_MIDPOINT_PRED_DEGREE']),
                    1 : _.get(this.school, fields['COMPLETION_MIDPOINT_ALL'])}
            return medians;
        },     
        fakeMedianEarnings() {
            var medians = {
                1 : 
                    { 0 : 28589,
                    1 : 38461 },
                2 : 
                    { 0 : 37840,
                    1 : 38461 },
                3 : 
                    { 0 : 50482,
                    1 : 38461 },                                
            }

            return medians;
        },
        fakeAverageAnnualCosts() {
            var medians = {
                1 : 
                    { 0 : 16163,
                    1 : 16007 },
                2 : 
                    { 0 : 8432,
                    1 : 16007 },
                3 : 
                    { 0 : 18902,
                    1 : 16007 },                                
            }
            return medians;
        },      
        fakeGraduationRate() {
            var medians = {
                1 : 
                    { 0 : 0.6804,
                    1 : 0.5938 },
                2 : 
                    { 0 : 0.3158,
                    1 : 0.5938 },
                3 : 
                    { 0 : 0.5789,
                    1 : 0.5938 },                                
            }
            return medians;
        },        
        standardizedTestText() {
            var categoryText = "";
            var rangeText = "";

            var stValue = this.standardizedTestValue;
            
            if (!this.school) return null;

            var acceptanceText = "  ";
            
            if (this.acceptanceRateActual == 1 && this.openAdmissions != 1) {
                acceptanceText = this.schoolName + " has an acceptance rate of 100%, which means that all students who apply are accepted. "
            }
            else if (this.openAdmissions != 1 && this.acceptanceRateActual) {
                acceptanceText =  this.schoolName + " has an acceptance rate of " + Math.round(this.acceptanceRateActual * 100)+"%" + ". "
            }
            else if (this.openAdmissions == 1) {
                acceptanceText =  this.schoolName + " has an open admission policy, which means that all students who apply are accepted. "
            }            
            else {
                acceptanceText = "";
            }

            switch (stValue) {
                case 1:
                    categoryText = this.schoolName + " requires admission test scores (SAT/ACT) during the application process. ";
                    rangeText = "Students who were admitted to " + this.schoolName +  " and enrolled typically had admission test scores in these ranges.";
                    break;
                case 5:
                    categoryText = this.schoolName + " considers admission test scores (SAT/ACT) during the application process, but does not require them. ";
                    rangeText = "Students who were admitted to " + this.schoolName +  " and enrolled typically had admission test scores in these ranges.";
                    break;
                case 2:
                    categoryText = this.schoolName + " recommends students provide admission test scores (SAT/ACT), during the application process. ";
                    break;
                case 3:
                    categoryText = this.schoolName + " does not require admission test scores (SAT/ACT) during the application process and does not recommend that students provide them. ";
                    break;
                case 4:
                    categoryText = "The admission test score (SAT/ACT) policy for " + this.schoolName + " is unknown. "; 
                    break;     
                case null:
                    categoryText = "The admission test score (SAT/ACT) policy for " + this.schoolName + " is unknown. "; 
                    break;                                                                                 
            }
            return acceptanceText + categoryText + rangeText;
        },
        standardizedTestValue() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['TEST_REQUIREMENTS'])
        }  ,
        percentMoreThanHS() {
            if (!this.school) return null;
            return _.get(this.school, this.fields['EARNINGS_GT_HS'])            
        },
        schoolDegreeList() {
            if (!this.school) return null;
            let programs = _.get(this.school, this.fields.FIELD_OF_STUDY);
            let programLevels  = []
            programLevels = programs.map(p => p.credential.level).filter((x, i, a) => a.indexOf(x) == i)

            var degreeLevels = programLevels.filter((x, i, a) => [2,3,5,6,7].includes(x))
            var certLevels = programLevels.filter((x, i, a) => [4,8].includes(x))
            var ugCertLevels = programLevels.filter((x, i, a) => [1].includes(x))

            var degreesList = ""
            var certList = ""  
            var ugCertList = ""

            for (var level of degreeLevels)
            {
                var label = formMappings['fosDegrees'].find(e => e.value === level.toString())['label'].replace(" Degree", "");
                if (level == degreeLevels[degreeLevels.length - 1]) {
                    if (degreeLevels.length > 1)
                        degreesList += " and " + label  + " Degrees"
                    else 
                        degreesList += label  + " Degrees"
                }
                else if (level == degreeLevels[degreeLevels.length - 2])
                    degreesList += label
                else
                    degreesList += label + ", "
            }

            for (var level of certLevels)
            {
                var label = formMappings['fosDegrees'].find(e => e.value === level.toString())['label'].replace(" Certificate", "")
                
                if (level == certLevels[certLevels.length - 1]) {
                    
                    if (certLevels.length > 1)
                        certList += " and " + label + " Certificates"
                    else 
                        certList += label + " Certificates"
                }
                else if (level == certLevels[certLevels.length - 2])
                    certList += label
                else
                    certList += label + ", "
            }

            for (var level of ugCertLevels)
            {
                var label = formMappings['fosDegrees'].find(e => e.value === level.toString())['label']
                
                ugCertList = label
            }            

            var ret = degreesList + ((degreesList && certList) ? " as well as " + certList : certList) + (((certList || degreesList) && ugCertList) ?  ", and " + ugCertList : ugCertList)

            if (certLevels.length == 0 && degreeLevels.length == 0)
                ret = "no Degrees or Certificates"

            return ret;
        }      
    },
    methods: {
        orderByWithNullsAtEnd(pArray, pAttr, pReverse) {
            const partition = _.partition(pArray, (x) => !!_.get(x, pAttr, null));
            return _.concat(_.orderBy(partition[0], pAttr, (pReverse ? 'desc' : 'asc')), partition[1]);
          },        
        // Moving items down here for easier testing.
        formatParentPlusText(min, max) {
            return `${min}-${max}%`;
        },    
        cleanDebt(fos, aidShowMedianDebtWithPrior, aidLoanSelect){
            let cleanDebt = fos.reduce((result, fieldOfStudy) => {
                if(fieldOfStudy.credential.level <= 3){
                    let tempObject = {
                        debt:null,
                        title: fieldOfStudy.title,
                        credential:{
                            title: fieldOfStudy.credential.title
                        }
                    }

                    if(aidShowMedianDebtWithPrior){
                        if(aidLoanSelect === 'fed'){
                            tempObject.debt = _.get(fieldOfStudy, fields['FOS_DEBT_MEDIAN_PRIOR']);
                            tempObject.payment = _.get(fieldOfStudy, fields['FOS_DEBT_MONTHLY_PRIOR']);
                        }else{
                            tempObject.debt = _.get(fieldOfStudy, fields['FOS_PP_DEBT_MEDIAN_PRIOR']);
                            tempObject.payment = _.get(fieldOfStudy, fields['FOS_PP_DEBT_MONTHLY_PRIOR']);
                        }
                    }else{
                        if(aidLoanSelect === 'fed'){
                            tempObject.debt = _.get(fieldOfStudy, fields['FOS_DEBT_MEDIAN']);
                            tempObject.payment = _.get(fieldOfStudy, fields['FOS_DEBT_MONTHLY']);
                        }else{
                            tempObject.debt = _.get(fieldOfStudy, fields['FOS_PP_DEBT_MEDIAN']);
                            tempObject.payment = _.get(fieldOfStudy, fields['FOS_PP_DEBT_MONTHLY']);
                        }
                    }

                    result.push(tempObject);
                }

                return result;
            },[]);

            return cleanDebt;
        },
        generateDebtRange(fieldsOfStudy, aidShowMedianDebtWithPrior, aidLoanSelect){
            // let fos = this.allFieldsOfStudy;
            if(!fieldsOfStudy.length)
            {
                fieldsOfStudy = [fieldsOfStudy];
            }
            let cleanDebt = fieldsOfStudy.reduce((result, fieldOfStudy) => {
                if(fieldOfStudy.credential.level <= 3){
                    let tempObject = {
                        debt:null,
                        title: fieldOfStudy.title,
                        credential:{
                            title: fieldOfStudy.credential.title
                        }
                    }

                    if(aidShowMedianDebtWithPrior){
                        if(aidLoanSelect === 'fed'){
                            tempObject.debt = _.get(fieldOfStudy, fields['FOS_DEBT_MEDIAN_PRIOR']);
                            tempObject.payment = _.get(fieldOfStudy, fields['FOS_DEBT_MONTHLY_PRIOR']);
                        }else{
                            tempObject.debt = _.get(fieldOfStudy, fields['FOS_PP_DEBT_MEDIAN_PRIOR']);
                            tempObject.payment = _.get(fieldOfStudy, fields['FOS_PP_DEBT_MONTHLY_PRIOR']);
                        }
                    }else{
                        if(aidLoanSelect === 'fed'){
                            tempObject.debt = _.get(fieldOfStudy, fields['FOS_DEBT_MEDIAN']);
                            tempObject.payment = _.get(fieldOfStudy, fields['FOS_DEBT_MONTHLY']);
                        }else{
                            tempObject.debt = _.get(fieldOfStudy, fields['FOS_PP_DEBT_MEDIAN']);
                            tempObject.payment = _.get(fieldOfStudy, fields['FOS_PP_DEBT_MONTHLY']);
                        }
                    }

                    result.push(tempObject);
                }

                return result;
            },[]);

            let orderedDebt = cleanDebt.sort(
              (a, b) => a.debt - b.debt
            ).filter(x => x.debt);


            if(orderedDebt[0]==null)
            {
                return null;
            }
            else
            {
                return {
                    single: orderedDebt.length == 1 || (orderedDebt[0].debt == orderedDebt[orderedDebt.length-1].debt),
                    min: orderedDebt[0],
                    max: orderedDebt[orderedDebt.length - 1],
                    median: orderedDebt[Math.floor(orderedDebt.length / 2)]
                }
            }
            
        },
        // Take Institution Field of study return object and return categorized result by credential level
        categorizeFieldsOfStudy(fieldsOfStudy){
        // Set up return object
        let filteredArray = [
            {
                key: 'certificate',
                title: 'certificate',
                filterValue: 1,
                items: []
            },
            {
                key: 'associate',
                title: "associate's Degree",
                filterValue: 2,
                items: []
            },
            {
                key: 'bachelor',
                title: "bachelor's Degree",
                filterValue: 3,
                items:[]
            },
            {
                key: 'postbaccalaureate',
                title: "post-baccalaureate Certificate",
                filterValue: 4,
                items:[]
            },
            {
                key: 'master',
                title: "master's Degree",
                filterValue: 5,
                items:[]
            },
            {
                key: 'doctor',
                title: "doctoral Degree",
                filterValue: 6,
                items:[]
            },
            {
                key: 'firstprofessional',
                title: "first Professional Degree",
                filterValue: 7,
                items:[]
            },
            {
                key: 'graduatecertificate',
                title: "graduate/Professional Certificate",
                filterValue: 8,
                items:[]
            }
        ]

        // Categorize field of study by credential type;
        filteredArray = filteredArray.map((filterItem) => {
            filterItem.items = fieldsOfStudy.filter((fieldOfStudy) => {
                return _.get(fieldOfStudy, fields.FOS_CREDENTIAL_LEVEL) === filterItem.filterValue;
            });

            return filterItem;
        });

        // Return only items that have counts
        return filteredArray.filter((filterItem)=>{ return filterItem.items.length > 0; });
        },
        fieldOfStudyCompareFormat(fieldOfStudyReturnObject){
            // Fixing small formatting issue with cred level 3 title formatting.  May be fixed in the data at some point;
            return {
                institutionName: _.get(fieldOfStudyReturnObject,'school.name'),
                credentialTitle: (Number(_.get(fieldOfStudyReturnObject,'credential.level')) === 3) ? "Bachelor's Degree" : _.get(fieldOfStudyReturnObject,'credential.title'),
                fosTitle: _.get(fieldOfStudyReturnObject,'title'),
                id: _.get(fieldOfStudyReturnObject,'unit_id'),
                code: _.get(fieldOfStudyReturnObject,'code'),
                credentialLevel: _.get(fieldOfStudyReturnObject,'credential.level'),
            };
        }
    }
}
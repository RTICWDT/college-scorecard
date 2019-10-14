export default {
    computed: {
        fields() {
            return picc.fields;
        },
        schoolName() {
            return _.get(this.school, this.fields['NAME'], 'School Name');
        },
        underInvestigation() {
            return _.get(this.school, this.fields['UNDER_INVESTIGATION']);
        },
        years() {
            return _.get(this.school, this.fields["PREDOMINANT_DEGREE"]);
        },
        awardLevels() {
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
            return _.get(this.school, this.fields['NET_PRICE'])
        },
        undergraduates(){
            return _.get(this.school, this.fields['SIZE'])
        },
        publicPrivate() {
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
            let income = _.get(this.school, this.fields["NET_PRICE_BY_INCOME"]);
            return income[this.publicPrivate]["by_income_level"];
        },
        specialDesignations() {
            var designations = [];
            var SPECIAL_DESIGNATIONS = picc.SPECIAL_DESIGNATIONS || {};

            if (+_.get(this.school, this.fields.WOMEN_ONLY)) {
                designations.push(SPECIAL_DESIGNATIONS.women_only);
            } else if (+_.get(this.school, this.fields.MEN_ONLY)) {
                designations.push(SPECIAL_DESIGNATIONS.men_only);
            }

            var religious = _.get(this.school, this.fields.RELIGIOUS);
            if (religious in picc.RELIGIOUS_AFFILIATIONS_BY_NUMBER) {
                designations.push(picc.RELIGIOUS_AFFILIATIONS_BY_NUMBER[religious]);
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
            let output = [];
            let re = _.get(this.school, this.fields["RACE_ETHNICITY"]);
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
                output.push({
                    label: picc.RACE_ETHNICITY_LABELS[include[p]],
                    value: re[include[p]]
                });
            }

            return _.sortBy(output, ["value"]).reverse();
        },
        retentionRate() {
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
            let OM = _.get(this.school, this.fields.COMPLETION_OM);
            let G200_4 = _.get(this.school, this.fields.COMPLETION_200_4);
            let G200_LT4 = _.get(this.school, this.fields.COMPLETION_200_LT4);
            if (!OM && !G200_4 && !G200_LT4) {
                return false;
            } else if (OM) {
                return OM;
            } else {
                return this.years == 3 ? G200_4 : G200_LT4;
            }
        },
        programReporter() {
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
            return _.get(this.school, this.fields.PROGRAM_REPORTER_OFFERED) > 0;
        },
        isBranch() {
            // 0 not main
            // 1 main
            return _.get(this.school, this.fields["MAIN"]) === 0;
        },
        schoolUrl() {
            let url = _.get(this.school, this.fields['SCHOOL_URL'], '#');
            if (url == '#') return false;
            else if (url.match(/^http/)) return url;
            else return 'http://' + url;
        },

        fullTimeEnrollment() {
            return 1 - (_.get(this.school, this.fields['PART_TIME_SHARE']));
        },
        partTimeEnrollment() {
            return _.get(this.school, this.fields['PART_TIME_SHARE']);
        },
        socioEconomicDiversity() {
            return _.get(this.school, this.fields['PELL_PERCENTAGE']);
        },
        netPriceCalculatorUrl() {
            return _.get(this.school, this.fields['NET_PRICE_CALC_URL'], '#');
        },
        allFieldsOfStudy() {
            return _.get(this.school, this.fields['FIELD_OF_STUDY']);
        },
        debtRange() {
            let fos = this.allFieldsOfStudy;
            let cleanDebt = fos.filter(
                obj => obj.debt.median_debt && obj.credential.level <= 3
            );
            let orderedDebt = cleanDebt.sort(
                (a, b) => a.debt.median_debt - b.debt.median_debt
            );
            return {
                singlle: orderedDebt.length == 1 || (orderedDebt.length == 2 && orderedDebt[0].debt.median_debt == orderedDebt[1].debt.median_debt),
                min: orderedDebt[0],
                max: orderedDebt[orderedDebt.length - 1]
            }
        },
        earningsRange() {
            let fos = this.allFieldsOfStudy;
            let cleanEarnings = fos.filter(
                obj => obj.earnings.median_earnings && obj.credential.level <= 3
            );
            let orderedEarnings = cleanEarnings.sort(
                (a, b) => a.earnings.median_earnings - b.earnings.median_earnings
            );
            return {
                single: orderedEarnings.length == 1 || (orderedEarnings.length == 2 && orderedEarnings[0].earnings.median_earnings == orderedEarnings[1].earnings.median_earnings),
                min: orderedEarnings[0],
                max: orderedEarnings[orderedEarnings.length - 1]
            }
        },
        act(){
            return{
                available: _.get(this.school, this.fields['ACT_MIDPOINT'])!=null,
                lower: _.get(this.school, this.fields['ACT_25TH_PCTILE']),
                upper: _.get(this.school, this.fields['ACT_75TH_PCTILE']),
                min: 0, 
                max: 36
            }
        },
        satReading(){
            return{
                available: _.get(this.school, this.fields['SAT_READING_MIDPOINT'])!=null,
                lower: _.get(this.school, this.fields['SAT_READING_25TH_PCTILE']),
                upper: _.get(this.school, this.fields['SAT_READING_75TH_PCTILE']),
                min: 0, 
                max: 800
            }
        },
        satMath(){
            return{
                available: _.get(this.school, this.fields['SAT_MATH_MIDPOINT'])!=null,
                lower: _.get(this.school, this.fields['SAT_MATH_25TH_PCTILE']),
                upper: _.get(this.school, this.fields['SAT_MATH_75TH_PCTILE']),
                min: 0,
                max: 800
            }
        },
        admittanceRate(){
            return _.get(this.school, this.fields['ADMITTANCE_RATE'])
        },
        openAdmissions(){
            return _.get(this.school, this.fields['OPEN_ADMISSIONS'])
        },
        studentsReceivingLoans(){
            return _.get(this.school, this.fields['AID_PERCENTAGE']);
        }

    }
}
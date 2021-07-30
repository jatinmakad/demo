import numeral from 'numeral';

// for sorting the data according to the cases in desending order.
export const sortData = (data) => {
    const sortedData = [...data];

    sortedData.sort((a, b) => {
        if(a.cases > b.cases){
            return -1;
        }else{
            return 1;
        }
        // -1 means the first one(a) will come first, if 1 then second one(b) will come first.
    });
    return sortedData;
}

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";


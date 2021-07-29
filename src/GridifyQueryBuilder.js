const QueryStartValue = "?"
const FilterStartValue = "filter=";

export default function GridifyQueryBuilder() {

    this.query = QueryStartValue;
    this.filter = FilterStartValue;

    this.onQueryAdd = function() {
        if(this.query !== QueryStartValue) 
            this.query += '&';
    }

    // sorting & pagination

    this.setPageSize = function(pageSize) {
        this.onQueryAdd();
        this.query += new URLSearchParams({pageSize: pageSize});
        return this;
    };

    this.setPage = function(page) {
        this.onQueryAdd();
        this.query += new URLSearchParams({page: page});
        return this;
    };

    this.setSortBy = function(fieldName) {
        this.onQueryAdd();
        this.query += new URLSearchParams({sortBy: fieldName});
        return this;
    };

    this.setOrder = function(isAscending) {
        this.onQueryAdd();
        this.query += new URLSearchParams({isSortAsc: isAscending});
        return this;       
    }

    // filtering

    this.setFilterGreaterThan = function(name, value) {
        this.filter += `${name}>>${value}`;
        return this;
    };        

    this.setFilterGreaterOrEqual = function(name, value) {
        this.filter += `${name}>=${value}`;
        return this;
    };        

    this.setFilterLessThan = function(name, value) {
        this.filter += `${name}<<${value}`;
        return this;
    };  

    this.setFilterLessOrEqual = function(name, value) {
        this.filter += `${name}<=${value}`;
        return this;
    };  

    this.setFilterEquals = function(name, value) {
        this.filter += `${name}==${value}`;
        return this;     
    };

    this.setFilterAnd = function() {
        this.filter += ',';
        return this;
    };

    // building

    this.build = function() {
        return (
            (this.query != QueryStartValue ? this.query : '') + 
            (this.filter != FilterStartValue ? ((this.query != QueryStartValue ? '&' : '') + this.filter) : '')
        );
    };
}
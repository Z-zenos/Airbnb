const mongoose = require('mongoose');

class APIFeatures {
  constructor(Query, queryString) {
    this.Query = Query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };

    /*
      Exclude these special field names from our query string
      before filtering. Because these special fields will have their own handler function.
    */
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Query for array
    Object.keys(queryObj).forEach(key => {
      if(Array.isArray(queryObj[key]))
        queryObj[key] = {
          '$all': queryObj[key]
        };

      if(mongoose.isValidObjectId(queryObj[key])) {
        queryObj[key] = new mongoose.Types.ObjectId(queryObj[key]);
      }
    });

    console.log(queryObj);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      op => `$${op}`
    );
    // queryStr = { "duration": { "$gt":"7" } }

    console.log(queryStr);

    this.Query = this.Query.find(JSON.parse(queryStr));

    // For chaining methods
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.Query = this.Query.sort(
        this.queryString.sort.replace(/,/g, _ => ' ')
      );
    }
    else {
      this.Query = this.Query.sort('-createdAt');
    }
    return this;
  }

  paginate() {
    const page = +this.queryString.page || 1,
      limit = +this.queryString.limit || 12, // number of documents per page
      skip = (page - 1) * limit;

    this.Query = this.Query.skip(skip).limit(limit);
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      this.Query = this.Query.select(this.queryString.fields
        .split(',')
        .join(' ')
      );
    }
    else { // default
      this.Query = this.Query.select('-__v');
    }
    return this;
  }
}

module.exports = APIFeatures;
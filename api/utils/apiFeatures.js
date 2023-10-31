const mongoose = require('mongoose');

class APIFeatures {
  rules = ['commercial_photography_and_filming_allowed', 'smoking_allowed', 'events_allowed', 'pets_allowed'];

  constructor(Query, queryString) {
    this.Query = Query;
    this.queryString = queryString;
  }

  filter(count = false) {
    const queryObj = { ...this.queryString };

    /*
      Exclude these special field names from our query string
      before filtering. Because these special fields will have their own handler function.
    */
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    Object.keys(queryObj).forEach(key => {
      if(Array.isArray(queryObj[key]))
        queryObj[key] = {
          '$all': queryObj[key]
        };

      else if(mongoose.isValidObjectId(queryObj[key].toString())) {
        queryObj[key] = new mongoose.Types.ObjectId(queryObj[key]);
      }

      else if (this.rules.includes(key)) {
        Object.defineProperty(queryObj, `rules.${key}`, Object.getOwnPropertyDescriptor(queryObj, key));
        delete queryObj[key];
      }
    });

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      op => `$${op}`
    );

    console.log(JSON.parse(queryStr));

    this.Query = this.Query[count ? 'countDocuments' : 'find'](JSON.parse(queryStr));

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

    console.log(skip, page);

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
exports.capitalize = (name) => {
    let nameArr = name.split(" ");
    nameArr = nameArr.filter((name) => name != "");
    let capitalized = "";
    nameArr.forEach((name) => {
      name = name[0].toUpperCase() + name.substring(1).toLowerCase();
      capitalized = capitalized + name + " ";
    });
    return capitalized.trim()
  };
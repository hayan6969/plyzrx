import generateUniqueid from "generate-unique-id";

const generateNumber = () => {
  const id = generateUniqueid({
    length: 4,
    useLetters: false,
    useNumbers: true,
  });

  return id;
};

export default generateNumber ;

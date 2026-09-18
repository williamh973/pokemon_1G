const determineSRF = () => {
  return 1;
};

const determineEB = () => {
  return 1;
};

const determineTL = () => {
  return 1;
};

const determineTRB = () => {
  return 1;
};

export const calculateMod3 = (action) => {
  const SRF = determineSRF();
  const EB = determineEB();
  const TL = determineTL();
  const TRB = determineTRB();

  const result = SRF * EB * TL * TRB;

  return result;
};

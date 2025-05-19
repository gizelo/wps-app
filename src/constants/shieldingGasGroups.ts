export const shieldingGasGroups = [
  {
    Symbol: "I",
    Processes: null,
    Description: "inert gases and inert gas mixtures",
    Subgroups: [
      {
        Symbol: "I1",
        Processes: [15, 141, 142, 143, 131, 151, 153, 154, 155],
        Manufacturers: ["Linde"],
        Description: "Ar = 100",
      },
      {
        Symbol: "I2",
        Processes: [15, 141, 142, 143, 131, 151, 153, 154, 155],
        Manufacturers: ["Linde"],
        Description: "He = 100",
      },
      {
        Symbol: "I3",
        Processes: [15, 141, 142, 143, 131, 151, 153, 154, 155],
        Manufacturers: ["Linde"],
        Description: "Ar = Balance, 0,5 ≤ He ≤ 95",
      },
    ],
  },
  {
    Symbol: "M1",
    Processes: null,
    Description: "Oxidising mixtures containing oxygen and/or carbon dioxide",
    Subgroups: [
      {
        Symbol: "M11",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "0,5 ≤ CO2 ≤ 5, Ar = Balance, He = Balance, 0,5 ≤ H2 ≤ 5",
      },
      {
        Symbol: "M12",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "0,5 ≤ CO2 ≤ 5, Ar = Balance, He = Balance",
      },
      {
        Symbol: "M13",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "0,5 ≤ O2 ≤ 3, Ar = Balance, He = Balance",
      },
      {
        Symbol: "M14",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "0,5 ≤ CO2 ≤ 5, 0,5 ≤ O2 ≤ 3, Ar = Balance, He = Balance",
      },
    ],
  },
  {
    Symbol: "M2",
    Processes: null,
    Description: "Oxidising mixtures containing oxygen and/or carbon dioxide",
    Subgroups: [
      {
        Symbol: "M20",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "5 < CO2 ≤ 15, Ar = Balance, He = Balance",
      },
      {
        Symbol: "M21",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "15 < CO2 ≤ 25, Ar = Balance, He = Balance",
      },
      {
        Symbol: "M22",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "3 < O2 ≤ 10, Ar = Balance, He = Balance",
      },
      {
        Symbol: "M23",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "0,5 ≤ CO2 ≤ 5, 3 < O2 ≤ 10, Ar = Balance, He = Balance",
      },
      {
        Symbol: "M24",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "5 ≤ CO2 ≤ 15, 0,5 ≤ O2 ≤ 3, Ar = Balance, He = Balance",
      },
      {
        Symbol: "M25",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "5 ≤ CO2 ≤ 15, 3 ≤ O2 ≤ 10, Ar = Balance, He = Balance",
      },
      {
        Symbol: "M26",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "15 ≤ CO2 ≤ 25, 0,5 ≤ O2 ≤ 3, Ar = Balance",
      },
      {
        Symbol: "M27",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "15 ≤ CO2 ≤ 25, 3 ≤ O2 ≤ 10, Ar = Balance, He = Balance",
      },
    ],
  },
  {
    Symbol: "M3",
    Processes: null,
    Description: "Oxidising mixtures containing oxygen and/or carbon dioxide",
    Subgroups: [
      {
        Symbol: "M31",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "25 < CO2 ≤ 50, Ar = Balance, He = Balance",
      },
      {
        Symbol: "M32",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "10 < O2 ≤ 15, Ar = Balance, He = Balance",
      },
      {
        Symbol: "M33",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "25 < CO2 ≤ 50, 2 < O2 ≤ 10, Ar = Balance, He = Balance",
      },
      {
        Symbol: "M34",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "25 ≤ CO2 ≤ 50, 2 < O2 ≤ 10, Ar = Balance, He = Balance",
      },
      {
        Symbol: "M35",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "25 ≤ CO2 ≤ 50, 10 ≤ O2 ≤ 15, Ar = Balance, He = Balance",
      },
    ],
  },
  {
    Symbol: "C",
    Processes: null,
    Description: "Highly oxidising gas and highly oxidising mixtures",
    Subgroups: [
      {
        Symbol: "C1",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "100",
      },
      {
        Symbol: "C2",
        Processes: [135, 136, 137, 138, 147],
        Manufacturers: ["Linde"],
        Description: "CO2 = Balance, 0,5 ≤ O2 ≤ 30",
      },
    ],
  },
  {
    Symbol: "R",
    Processes: null,
    Description: "Reducing gas mixtures",
    Subgroups: [
      {
        Symbol: "R1",
        Processes: [145, 146],
        Manufacturers: ["Linde"],
        Description: "Ar = Balance, He = Balance, 0,5 ≤ H2 ≤ 15",
      },
      {
        Symbol: "R2",
        Processes: [145, 146],
        Manufacturers: ["Linde"],
        Description: "Ar = Balance, He = Balance, 15 ≤ H2 ≤ 50",
      },
    ],
  },
  {
    Symbol: "N",
    Processes: null,
    Description:
      "Low reactive gas or reducing gas mixtures, containing nitrogen",
    Subgroups: [
      {
        Symbol: "N1",
        Processes: null,
        Manufacturers: ["Linde"],
        Description: "N2 = 100",
      },
      {
        Symbol: "N2",
        Processes: null,
        Manufacturers: ["Linde"],
        Description: "Ar = Balance, He = Balance, 0,5 ≤ N2 ≤ 5",
      },
      {
        Symbol: "N3",
        Processes: null,
        Manufacturers: ["Linde"],
        Description: "Ar = Balance, He = Balance, N2 = Balance, 5 ≤ N2 ≤ 50",
      },
      {
        Symbol: "N4",
        Processes: null,
        Manufacturers: ["Linde"],
        Description: "Ar = Balance, He = Balance, 0,5 ≤ H2 ≤ 10, 0,5 ≤ N2 ≤ 5",
      },
      {
        Symbol: "N5",
        Processes: null,
        Manufacturers: ["Linde"],
        Description: "0,5 ≤ H2 ≤ 50, N2 = Balance",
      },
    ],
  },
  {
    Symbol: "O",
    Processes: null,
    Description: "Oxygen",
    Subgroups: [
      {
        Symbol: "O1",
        Processes: null,
        Manufacturers: ["Linde"],
        Description: "O2: 100",
      },
    ],
  },
  {
    Symbol: "Z",
    Processes: null,
    Description:
      "Gas mixtures containing components not listed or mixtures outside the composition ranges",
    Subgroups: [
      {
        Symbol: "Z",
        Processes: null,
        Manufacturers: ["Linde"],
        Description: "Special mixtures depending on application",
      },
    ],
  },
];

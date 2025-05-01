document.addEventListener("DOMContentLoaded", function () {
  const saveButton = document.getElementById("saveButton");

  saveButton.addEventListener("click", function () {
    const formData = collectFormData();
    downloadJSON(formData);
  });
});

function collectFormData() {
  const formData = {
    header: {
      wpsNr: getValue("wpsNr"),
      revision: getValue("revision"),
    },
    generalInfo: {
      city: getValue("city"),
      examiner: getValue("examiner"),
      wparNumber: getValue("wparNumber"),
      preparationMethod: getValue("preparationMethod"),
      welderQualification: getValue("welderQualification"),
      rootPassPrep: getValue("rootPassPrep"),
      weldingProcess: getValue("weldingProcess"),
      baseMetal1: getValue("baseMetal1"),
      materialType: getValue("materialType"),
      baseMetal2: getValue("baseMetal2"),
      customer: getValue("customer"),
      plateThickness: getValue("plateThickness"),
      supervisor: getValue("supervisor"),
      outsideDiameter: getValue("outsideDiameter"),
      itemNumber: getValue("itemNumber"),
      preheatTemp: getValue("preheatTemp"),
      drawing: getValue("drawing"),
      intermediateTemp: getValue("intermediateTemp"),
    },
    remarks: document.querySelector('textarea[name="remarks"]').value,
    weldingDetails: collectTableData("welding-details"),
    fillerMetal: collectTableData("filler-metal"),
    shieldingGas: collectTableData("shielding-gas"),
    furtherInfo: collectTableData("further-info"),
  };

  return formData;
}

function getValue(name) {
  const element = document.querySelector(`[name="${name}"]`);
  return element ? element.value : "";
}

function collectTableData(tableClass) {
  const table = document.querySelector(`.${tableClass}`);
  const rows = table.querySelectorAll("tbody tr");
  const data = [];

  rows.forEach((row) => {
    const rowData = {};
    const inputs = row.querySelectorAll("input");
    inputs.forEach((input) => {
      if (input.name) {
        rowData[input.name] = input.value;
      } else {
        // If input doesn't have a name, use its parent cell's header as the key
        const headerIndex = Array.from(row.cells).findIndex((cell) =>
          cell.contains(input)
        );
        const headerText = table.querySelector(
          "thead th:nth-child(" + (headerIndex + 1) + ")"
        ).textContent;
        rowData[headerText] = input.value;
      }
    });
    data.push(rowData);
  });

  return data;
}

function downloadJSON(data) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "wps-data.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

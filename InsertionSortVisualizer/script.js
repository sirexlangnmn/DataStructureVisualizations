let array = [5, 1, 4, 2, 8, 3, 7, 6, 10, 9];
    const container = document.getElementById("arrayContainer");
    const statusText = document.getElementById("status");
    const autoBtn = document.getElementById("autoBtn");
    const stepBtn = document.getElementById("stepBtn");

    function highlightCodeLine(lineNum) {
      for (let i = 1; i <= 9; i++) {
        document.getElementById("line" + i)?.classList.remove("highlight-line");
      }
      if (lineNum) {
        document.getElementById("line" + lineNum)?.classList.add("highlight-line");
      }
    }

    function renderArray(arr) {
      container.innerHTML = "";
      arr.forEach(num => {
        const div = document.createElement("div");
        div.className = "circle";
        div.textContent = num;
        container.appendChild(div);
      });
    }

    function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

    // ===== AUTO MODE (unchanged visual style) =====
    async function animateInsertionSort(arr) {
      autoBtn.disabled = true;
      stepBtn.disabled = true;
      renderArray(arr);

      for (let i = 1; i < arr.length; i++) {
        highlightCodeLine(3);
        let key = arr[i];
        let j = i - 1;
        statusText.textContent = `Picking ${key}`;
        const elements = container.children;

        // Pick up key (move up)
        elements[i].classList.add("highlight");
        elements[i].style.transform = "translateY(-60px)";
        await sleep(500);

        // Shift elements to the right while finding position
        while (j >= 0 && arr[j] > key) {
          highlightCodeLine(5);
          statusText.textContent = `Comparing ${arr[j]} > ${key} → shift right`;
          elements[j].style.transform = "translateX(66px)";
          arr[j + 1] = arr[j];
          j--;
          await sleep(500);
        }

        // Move key horizontally to its correct position
        const targetX = (j + 1 - i) * 66;
        elements[i].style.transform = `translate(${targetX}px, -60px)`;
        await sleep(500);

        // Drop key into place
        highlightCodeLine(8);
        elements[i].style.transform = `translate(${targetX}px, 0px)`;
        await sleep(500);

        // Re-render array with updated order
        arr[j + 1] = key;
        renderArray(arr);
        await sleep(300);
      }

      highlightCodeLine(9);
      Array.from(container.children).forEach(el => el.classList.add("done"));
      statusText.textContent = "✅ Sorting Done!";
      autoBtn.disabled = false;
      stepBtn.disabled = false;
    }

    autoBtn.onclick = () => {
      animateInsertionSort([...array]);
    };

    // ===== STEP-BY-STEP MODE =====
    let stepArr = [...array];
    let sI = 1;              // for i in range(1, n)
    let sJ = 0;              // j pointer
    let sKey = null;         // key value
    let sPhase = "idle";     // "idle" -> "init" -> "compare" -> "shift" -> "place" -> "drop" -> repeat
    let stepModeActive = false;
    let stepBusy = false;

    function setStatus(msg) { statusText.textContent = msg; }

    function startStepMode() {
      stepArr = [...array];
      sI = 1;
      sJ = sI - 1;
      sKey = null;
      sPhase = "init";
      stepModeActive = true;
      autoBtn.disabled = true;
      stepBtn.textContent = "Next Step";
      highlightCodeLine(null);
      renderArray(stepArr);
      setStatus("");
    }

    async function doStep() {
      if (stepBusy) return;
      stepBusy = true;

      // Done?
      if (sI >= stepArr.length) {
        highlightCodeLine(9);
        renderArray(stepArr);
        Array.from(container.children).forEach(el => el.classList.add("done"));
        setStatus("✅ Sorting Done!");
        stepModeActive = false;
        stepBtn.textContent = "Step-by-Step";
        autoBtn.disabled = false;
        stepBusy = false;
        return;
      }

      const elements = container.children;

      switch (sPhase) {
        case "init": {
          highlightCodeLine(2);
          // Pick key at i
          sKey = stepArr[sI];
          sJ = sI - 1;
          highlightCodeLine(3);
          elements[sI].classList.add("highlight");
          elements[sI].style.transform = "translateY(-60px)";
          setStatus(`Picking ${sKey} (index ${sI})`);
          sPhase = "compare";
          break;
        }

        case "compare": {
          highlightCodeLine(4);
          if (sJ >= 0 && stepArr[sJ] > sKey) {
            highlightCodeLine(5);
            setStatus(`Comparing ${stepArr[sJ]} > ${sKey} → shift right`);
            sPhase = "shift";
          } else {
            sPhase = "place";
          }
          break;
        }

        case "shift": {
          highlightCodeLine(6);
          // Visual shift of the element at j
          elements[sJ].style.transform = "translateX(66px)";
          // Logical shift in array
          stepArr[sJ + 1] = stepArr[sJ];
          sJ--;
          highlightCodeLine(7);
          sPhase = "compare";
          break;
        }

        case "place": {
          highlightCodeLine(8);
          // Move key horizontally to final slot (j+1)
          const targetX = (sJ + 1 - sI) * 66;
          elements[sI].style.transform = `translate(${targetX}px, -60px)`;
          setStatus(`Move key to index ${sJ + 1}`);
          sPhase = "drop";
          break;
        }

        case "drop": {
          // Drop key into place, update array, and re-render
          const targetX = (sJ + 1 - sI) * 66;
          elements[sI].style.transform = `translate(${targetX}px, 0px)`;
          await sleep(300);

          stepArr[sJ + 1] = sKey;
          renderArray(stepArr);
          setStatus(`Inserted ${sKey} at index ${sJ + 1}`);

          // Advance outer loop
          sI++;
          sJ = sI - 1;
          sKey = null;

          // Continue or finish
          sPhase = (sI < stepArr.length) ? "init" : "done";
          break;
        }

        case "done": {
          highlightCodeLine(9);
          renderArray(stepArr);
          Array.from(container.children).forEach(el => el.classList.add("done"));
          setStatus("✅ Sorting Done!");
          stepModeActive = false;
          stepBtn.textContent = "Step-by-Step";
          autoBtn.disabled = false;
          break;
        }

        default:
          sPhase = "init";
      }

      stepBusy = false;
    }

    stepBtn.onclick = async () => {
      if (!stepModeActive) {
        startStepMode();
        return;
      }
      await doStep();
    };

    renderArray(array);
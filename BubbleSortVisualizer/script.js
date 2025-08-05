   let array = [5, 1, 4, 2, 8, 3, 7, 6, 10, 9];
    const container = document.getElementById("arrayContainer");
    const statusText = document.getElementById("status");
    const autoBtn = document.getElementById("autoBtn");
    const stepBtn = document.getElementById("stepBtn");

    function highlightCodeLine(lineNum) {
      for (let i = 1; i <= 15; i++) {
        document.getElementById("line" + i)?.classList.remove("highlight-line");
      }
      if (lineNum) {
        document.getElementById("line" + lineNum)?.classList.add("highlight-line");
      }
    }

    function renderArray(arr, highlight = []) {
      container.innerHTML = "";

      arr.forEach((num, index) => {
        const div = document.createElement("div");
        div.className = "circle";
        div.textContent = num;
        if (highlight.includes(index)) {
          div.classList.add("highlight");
        }
        container.appendChild(div);
      });

      if (highlight.length === 2) {
        const el1 = container.children[highlight[0]];
        const el2 = container.children[highlight[1]];
        const left1 = el1.offsetLeft;
        const left2 = el2.offsetLeft;

        const connector = document.createElement("div");
        connector.className = "connector";
        connector.style.width = `${Math.abs(left2 - left1) + 50}px`;
        connector.style.left = `${Math.min(left1, left2)}px`;
        container.appendChild(connector);
      }
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function animateSwap(index1, index2) {
      const elements = container.children;
      const el1 = elements[index1];
      const el2 = elements[index2];
      const dist = el2.offsetLeft - el1.offsetLeft;

      el1.style.transform = `translateX(${dist}px)`;
      el2.style.transform = `translateX(${-dist}px)`;

      await sleep(500);

      el1.style.transform = "";
      el2.style.transform = "";
    }

    async function bubbleSortVisual(arr) {
      autoBtn.disabled = true;
      stepBtn.disabled = true;
      const n = arr.length;

      for (let i = 0; i < n; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
          highlightCodeLine(5);
          renderArray(arr, [j, j + 1]);
          statusText.innerHTML = `<span class="status-icon"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2194.png"> Comparing ${arr[j]} and ${arr[j + 1]}</span>`;
          await sleep(800);

          highlightCodeLine(6);
          if (arr[j] > arr[j + 1]) {
            highlightCodeLine(7);
            await animateSwap(j, j + 1);
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            swapped = true;
            renderArray(arr, [j, j + 1]);
            statusText.innerHTML = `<span class="status-icon"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f501.png"> Swapped ${arr[j]} and ${arr[j + 1]}</span>`;
            await sleep(800);
          }
        }
        if (!swapped) break;
      }

      highlightCodeLine(11);
      renderArray(arr);
      statusText.innerHTML = `<span class="status-icon"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2705.png"> Sorting Done!</span>`;
      Array.from(container.children).forEach(el => el.classList.add("done"));
      autoBtn.disabled = false;
      stepBtn.disabled = false;
    }

    // Step-by-step state
    let stepArray = [...array];
    let stepI = 0;
    let stepJ = 0;
    let stepSwapped = false;
    let stepModeActive = false;

    stepBtn.onclick = async () => {
      if (!stepModeActive) {
        stepArray = [...array];
        stepI = 0;
        stepJ = 0;
        stepSwapped = false;
        stepModeActive = true;
        autoBtn.disabled = true;
        stepBtn.textContent = "Next Step";
        renderArray(stepArray);
        return;
      }

      const n = stepArray.length;

      if (stepI >= n) {
        highlightCodeLine(11);
        renderArray(stepArray);
        statusText.innerHTML = `<span class="status-icon"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2705.png"> Sorting Done!</span>`;
        Array.from(container.children).forEach(el => el.classList.add("done"));
        stepModeActive = false;
        stepBtn.textContent = "Step-by-Step";
        autoBtn.disabled = false;
        return;
      }

      if (stepJ < n - stepI - 1) {
        highlightCodeLine(5);
        renderArray(stepArray, [stepJ, stepJ + 1]);
        statusText.innerHTML = `<span class="status-icon"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2194.png"> Comparing ${stepArray[stepJ]} and ${stepArray[stepJ + 1]}</span>`;
        highlightCodeLine(6);

        if (stepArray[stepJ] > stepArray[stepJ + 1]) {
          highlightCodeLine(7);
          await animateSwap(stepJ, stepJ + 1);
          [stepArray[stepJ], stepArray[stepJ + 1]] = [stepArray[stepJ + 1], stepArray[stepJ]];
          renderArray(stepArray, [stepJ, stepJ + 1]);
          statusText.innerHTML = `<span class="status-icon"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f501.png"> Swapped ${stepArray[stepJ]} and ${stepArray[stepJ + 1]}</span>`;
          stepSwapped = true;
        }
        stepJ++;
      } else {
        if (!stepSwapped) {
          stepI = n; // done early
        } else {
          stepI++;
          stepJ = 0;
          stepSwapped = false;
        }
      }
    };

    autoBtn.onclick = () => {
      renderArray([...array]);
      bubbleSortVisual([...array]);
    };

    renderArray(array);







    function goBack() {
      window.history.back();
    }
    let array = [5, 1, 4, 2, 8, 3, 7, 6, 10, 9];
    const container = document.getElementById("arrayContainer");
    const statusText = document.getElementById("status");
    const autoBtn = document.getElementById("autoBtn");
    const stepBtn = document.getElementById("stepBtn");

    function highlightCodeLine(lineNum) {
      for (let i = 1; i <= 14; i++) {
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

    async function selectionSortVisual(arr) {
      autoBtn.disabled = true;
      stepBtn.disabled = true;
      const n = arr.length;

      for (let i = 0; i < n; i++) {
        let minIndex = i;
        highlightCodeLine(4);
        renderArray(arr, [i]);
        await sleep(500);

        for (let j = i + 1; j < n; j++) {
          highlightCodeLine(5);
          renderArray(arr, [minIndex, j]);
          statusText.innerHTML = `<span class="status-icon"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2194.png"> Comparing ${arr[minIndex]} and ${arr[j]}</span>`;
          await sleep(800);

          highlightCodeLine(6);
          if (arr[j] < arr[minIndex]) {
            highlightCodeLine(7);
            minIndex = j;
          }
        }

        if (minIndex !== i) {
          highlightCodeLine(9);
          await animateSwap(i, minIndex);
          [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
          renderArray(arr, [i, minIndex]);
          statusText.innerHTML = `<span class="status-icon"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f501.png"> Swapped ${arr[i]} and ${arr[minIndex]}</span>`;
          await sleep(800);
        }
      }

      highlightCodeLine(10);
      renderArray(arr);
      statusText.innerHTML = `<span class="status-icon"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2705.png"> Sorting Done!</span>`;
      Array.from(container.children).forEach(el => el.classList.add("done"));
      autoBtn.disabled = false;
      stepBtn.disabled = false;
    }

    // Step-by-step logic
    let stepArray = [...array];
    let stepI = 0;
    let stepJ = 0;
    let stepMinIndex = 0;
    let stepModeActive = false;

    stepBtn.onclick = async () => {
      if (!stepModeActive) {
        stepArray = [...array];
        stepI = 0;
        stepJ = stepI + 1;
        stepMinIndex = stepI;
        stepModeActive = true;
        autoBtn.disabled = true;
        stepBtn.textContent = "Next Step";
        renderArray(stepArray, [stepI]);
        return;
      }

      const n = stepArray.length;
      if (stepI >= n) {
        highlightCodeLine(10);
        renderArray(stepArray);
        statusText.innerHTML = `<span class="status-icon"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2705.png"> Sorting Done!</span>`;
        Array.from(container.children).forEach(el => el.classList.add("done"));
        stepModeActive = false;
        stepBtn.textContent = "Step-by-Step";
        autoBtn.disabled = false;
        return;
      }

      if (stepJ < n) {
        highlightCodeLine(5);
        renderArray(stepArray, [stepMinIndex, stepJ]);
        statusText.innerHTML = `<span class="status-icon"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2194.png"> Comparing ${stepArray[stepMinIndex]} and ${stepArray[stepJ]}</span>`;
        highlightCodeLine(6);

        if (stepArray[stepJ] < stepArray[stepMinIndex]) {
          highlightCodeLine(7);
          stepMinIndex = stepJ;
        }
        stepJ++;
      } else {
        if (stepMinIndex !== stepI) {
          highlightCodeLine(9);
          await animateSwap(stepI, stepMinIndex);
          [stepArray[stepI], stepArray[stepMinIndex]] = [stepArray[stepMinIndex], stepArray[stepI]];
          renderArray(stepArray, [stepI, stepMinIndex]);
          statusText.innerHTML = `<span class="status-icon"><img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f501.png"> Swapped ${stepArray[stepI]} and ${stepArray[stepMinIndex]}</span>`;
          await sleep(800);
        }
        stepI++;
        stepJ = stepI + 1;
        stepMinIndex = stepI;
      }
    };

    autoBtn.onclick = () => {
      renderArray([...array]);
      selectionSortVisual([...array]);
    };

    renderArray(array);





    function goBack() {
      window.location.href = '../index.html';
    }
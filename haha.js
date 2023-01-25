const problemUrl = "/problemset/all/";

function getSolveStatus(callbackfn) {
  console.log("获取做题状态");
  // const payload = {
  //   operationName: "userQuestionSubmitStats",
  //   variables: { userSlug: "weiyinfu" },
  //   query:
  //     "query userQuestionSubmitStats($userSlug: String!) {\n  userProfileUserQuestionSubmitStats(userSlug: $userSlug) {\n    acSubmissionNum {\n      difficulty\n      count\n      __typename\n    }\n    totalSubmissionNum {\n      difficulty\n      count\n      __typename\n    }\n    __typename\n  }\n}\n",
  // };
  const payload = {
    query:
      "query userSessionProgress($userSlug: String!) {\n  userProfileUserQuestionSubmitStats(userSlug: $userSlug) {\n    acSubmissionNum {\n      difficulty\n      count\n    }\n    totalSubmissionNum {\n      difficulty\n      count\n    }\n  }\n  userProfileUserQuestionProgress(userSlug: $userSlug) {\n    numAcceptedQuestions {\n      difficulty\n      count\n    }\n    numFailedQuestions {\n      difficulty\n      count\n    }\n    numUntouchedQuestions {\n      difficulty\n      count\n    }\n  }\n}\n    ",
    variables: { userSlug: "weiyinfu" },
  };
  const parent = document.querySelector(
    "#__next > div > div > div.grid.grid-cols-4.md\\:grid-cols-3.lg\\:grid-cols-4.gap-4.lg\\:gap-6 > div.col-span-4.md\\:col-span-2.lg\\:col-span-3"
  );
  const son = document.querySelector(
    "#__next > div > div > div.grid.grid-cols-4.md\\:grid-cols-3.lg\\:grid-cols-4.gap-4.lg\\:gap-6 > div.col-span-4.md\\:col-span-2.lg\\:col-span-3 > div:nth-child(7)"
  );
  const ele = document.createElement("div");
  if (!parent) {
    console.error("找不到parent");
    return;
  }
  ele.style =
    "margin:20px;display:flex;align-items:center;justify-content:center;flex-direction:column;";
  parent.insertBefore(ele, son);
  console.log("发起网络请求获取做题数据");
  axios
    .post("https://leetcode.cn/graphql/", payload)
    .then((resp) => {
      console.log("拿到做题数据");
      console.log(resp.data);
      const { acSubmissionNum, totalSubmissionNum } =
        resp.data.data["userProfileUserQuestionSubmitStats"];

      function list2map(a) {
        const ma = {};
        for (let i of a) {
          ma[i.difficulty] = i.count;
        }
        return ma;
      }

      function getRate(up, down) {
        if (down === 0) {
          down = 1e-7;
        }
        return ((up / down) * 100).toFixed(2) + "%";
      }

      const ac = list2map(acSubmissionNum);
      const submit = list2map(totalSubmissionNum);
      let html = "";
      let table = [];
      for (let i of acSubmissionNum) {
        table.push([
          i.difficulty,
          ac[i.difficulty],
          submit[i.difficulty],
          getRate(ac[i.difficulty], submit[i.difficulty]),
        ]);
      }
      const totalAc = Object.values(ac).reduce((o, n) => o + n, 0);
      const totalSubmit = Object.values(submit).reduce((o, n) => o + n, 0);
      table.push(["All", totalAc, totalSubmit, getRate(totalAc, totalSubmit)]);
      console.log(table);
      for (let i of table) {
        html += `<tr>
<td style="border: solid 1px;">${i[0]}</td>
<td style="border: solid 1px;">${i[1]}</td>
<td style="border: solid 1px;">${i[2]}</td>
<td style="border: solid 1px;">${i[3]}</td>
</tr>`;
      }
      ele.innerHTML = `<h1>做题进度</h1>
<table style="min-height: 25px;color:rgb(220,220,220); line-height: 25px; text-align: center;  border-collapse: collapse;"><tbody>
<tr>
<th>难度</th>
<th>AC</th>
<th>Submit</th>
<th>Rate</th>
</tr>
${html}
</tbody>
</table>
`;
    })
    .catch((e) => {
      console.error("获取题目失败");
      console.error(e);
    });
  console.log("solveStatus done");
}

function hideVipProblems() {
  console.log("隐藏VIP题目");
  if (location.pathname.startsWith(problemUrl)) {
    const trs = document.querySelectorAll("[role=row]");
    const forbidden = `<path fill-rule="evenodd" clip-rule="evenodd" d="M6.64001 11.3335C6.79952 11.3335 6.93787 11.2749 7.05505 11.1577C7.17224 11.047 7.23083 10.9087 7.23083 10.7427V8.89209H8.62732C9.34347 8.89209 9.95382 8.63818 10.4584 8.13037C10.9662 7.62256 11.2201 7.01221 11.2201 6.29932C11.2201 5.58317 10.9662 4.97119 10.4584 4.46338C9.95382 3.95882 9.34347 3.70654 8.62732 3.70654C7.91443 3.70654 7.30408 3.95882 6.79626 4.46338C6.28845 4.97119 6.03455 5.58317 6.03455 6.29932V10.7427C6.03455 10.9087 6.09314 11.047 6.21033 11.1577C6.32751 11.2749 6.46586 11.3335 6.62537 11.3335H6.64001ZM8.62732 7.6958H7.23083V6.29932C7.23083 5.91195 7.36593 5.58154 7.63611 5.30811C7.90955 5.03467 8.23995 4.89795 8.62732 4.89795C9.01469 4.89795 9.34509 5.03467 9.61853 5.30811C9.88871 5.58154 10.0238 5.91195 10.0238 6.29932C10.0238 6.68669 9.88871 7.01546 9.61853 7.28564C9.34509 7.55908 9.01469 7.6958 8.62732 7.6958ZM13.266 11.1577C13.1488 11.2749 13.0105 11.3335 12.851 11.3335H12.8363C12.6768 11.3335 12.5385 11.2749 12.4213 11.1577C12.3041 11.047 12.2455 10.9087 12.2455 10.7427V4.29736C12.2455 4.1346 12.3041 3.99463 12.4213 3.87744C12.5385 3.76351 12.6768 3.70654 12.8363 3.70654H12.851C13.0105 3.70654 13.1488 3.76351 13.266 3.87744C13.3832 3.99463 13.4418 4.1346 13.4418 4.29736V10.7427C13.4418 10.9087 13.3832 11.047 13.266 11.1577ZM16.9769 11.3335C17.6247 11.3335 18.1797 11.1024 18.642 10.6401C19.1042 10.1779 19.3353 9.62288 19.3353 8.9751V6.3042C19.3353 6.14144 19.2767 6.00146 19.1595 5.88428C19.0489 5.76709 18.9105 5.7085 18.7445 5.7085H18.7347C18.572 5.7085 18.432 5.76709 18.3148 5.88428C18.1976 6.00146 18.139 6.14144 18.139 6.3042V8.9751C18.139 9.29736 18.0267 9.57243 17.8021 9.80029C17.5743 10.0249 17.2992 10.1372 16.9769 10.1372C16.6514 10.1372 16.3747 10.0249 16.1469 9.80029C15.9222 9.57243 15.8099 9.29736 15.8099 8.9751V6.3042C15.8099 6.14144 15.7513 6.00146 15.6342 5.88428C15.517 5.76709 15.3786 5.7085 15.2191 5.7085H15.2045C15.045 5.7085 14.9066 5.76709 14.7894 5.88428C14.6722 6.00146 14.6136 6.14144 14.6136 6.3042V8.9751C14.6136 9.62288 14.8448 10.1779 15.307 10.6401C15.7692 11.1024 16.3259 11.3335 16.9769 11.3335ZM23.1879 10.8354C22.8526 11.1675 22.4506 11.3335 21.9818 11.3335H20.7074C20.5479 11.3335 20.4095 11.2749 20.2924 11.1577C20.1752 11.047 20.1166 10.9087 20.1166 10.7427V10.7329C20.1166 10.5701 20.1752 10.4302 20.2924 10.313C20.4095 10.1958 20.5479 10.1372 20.7074 10.1372H22.0306C22.1739 10.1372 22.2943 10.0884 22.392 9.99072C22.4896 9.89307 22.5385 9.77262 22.5385 9.62939C22.5385 9.45036 22.4457 9.31527 22.2601 9.22412C22.2113 9.20133 21.9379 9.11995 21.4398 8.97998C21.0524 8.86605 20.7644 8.71631 20.5756 8.53076C20.3054 8.26709 20.1703 7.89437 20.1703 7.4126C20.1703 6.94385 20.3363 6.54346 20.6683 6.21143C21.0036 5.87614 21.4056 5.7085 21.8744 5.7085H22.7728C22.9356 5.7085 23.0756 5.76709 23.1927 5.88428C23.3099 6.00146 23.3685 6.14144 23.3685 6.3042V6.31396C23.3685 6.47998 23.3099 6.61833 23.1927 6.729C23.0756 6.84619 22.9356 6.90479 22.7728 6.90479H21.8256C21.6823 6.90479 21.5619 6.95361 21.4642 7.05127C21.3666 7.15218 21.3177 7.27262 21.3177 7.4126C21.3177 7.60791 21.4122 7.75439 21.601 7.85205C21.6661 7.88786 21.9379 7.96924 22.4164 8.09619C22.8038 8.20687 23.0918 8.35173 23.2806 8.53076C23.5508 8.78792 23.6859 9.15413 23.6859 9.62939C23.6859 10.0981 23.5199 10.5002 23.1879 10.8354Z" fill="white"></path>`;
    for (let i = 0; i < trs.length; i++) {
      if (trs[i].innerHTML.indexOf(forbidden) !== -1) {
        trs[i].style.display = "none";
      } else {
        trs[i].style.display = "flex";
      }
    }
  }
  setTimeout(hideVipProblems, 1000);
}

function main() {
  if (document.readyState !== "complete") {
    return;
  }
  hideVipProblems();
  setTimeout(hideVipProblems, 1000);
  try {
    getSolveStatus();
  } catch (e) {
    console.error("获取做题状态失败");
    console.error(e);
  }
}
document.addEventListener("readystatechange", (event) => {
  console.log("onready statechange ");
  main();
});
main();

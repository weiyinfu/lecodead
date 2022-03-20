const problemUrl = "/problemset/all/"

function getSolveStatus(callbackfn) {
    const payload = {
        "operationName": "userQuestionSubmitStats",
        "variables": {"userSlug": "weiyinfu"},
        "query": "query userQuestionSubmitStats($userSlug: String!) {\n  userProfileUserQuestionSubmitStats(userSlug: $userSlug) {\n    acSubmissionNum {\n      difficulty\n      count\n      __typename\n    }\n    totalSubmissionNum {\n      difficulty\n      count\n      __typename\n    }\n    __typename\n  }\n}\n"
    }
    const parent = document.querySelector("#__next > div > div > div.grid.grid-cols-4.md\\:grid-cols-3.lg\\:grid-cols-4.gap-4.lg\\:gap-6 > div.col-span-4.md\\:col-span-2.lg\\:col-span-3");
    const son = document.querySelector("#__next > div > div > div.grid.grid-cols-4.md\\:grid-cols-3.lg\\:grid-cols-4.gap-4.lg\\:gap-6 > div.col-span-4.md\\:col-span-2.lg\\:col-span-3 > div:nth-child(7)")
    const ele = document.createElement('div');
    if (!parent) {
        return;
    }
    ele.style = "margin:20px;display:flex;align-items:center;justify-content:center;flex-direction:column;"
    parent.insertBefore(ele, son);
    axios.post('/graphql/', payload).then(resp => {
        console.log(resp.data);
        const {acSubmissionNum, totalSubmissionNum} = resp.data['userProfileUserQuestionSubmitStats'];

        function list2map(a) {
            const ma = {}
            for (let i of a) {
                ma[i.difficulty] = i.count;
            }
            return ma;
        }

        function getRate(up, down) {
            if (down === 0) {
                down = 1e-7;
            }
            return (up / down * 100).toFixed(2) + "%"
        }

        const ac = list2map(acSubmissionNum);
        const submit = list2map(totalSubmissionNum);
        let html = ""
        let table = [];
        for (let i of acSubmissionNum) {
            table.push([i.difficulty, ac[i.difficulty], submit[i.difficulty], getRate(ac[i.difficulty], submit[i.difficulty])])
        }
        const totalAc = Object.values(ac).reduce((o, n) => o + n, 0);
        const totalSubmit = Object.values(submit).reduce((o, n) => o + n, 0)
        table.push(["All", totalAc, totalSubmit, getRate(totalAc, totalSubmit)])
        for (let i of table) {
            html += `<tr>
<td style="border: solid 1px;">${i[0]}</td>
<td style="border: solid 1px;">${i[1]}</td>
<td style="border: solid 1px;">${i[2]}</td>
<td style="border: solid 1px;">${i[3]}</td>
</tr>`
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
`
    })
}

function hideVipProblems() {
    if (location.pathname.startsWith(problemUrl)) {
        const trs = document.querySelectorAll("[role=row]")
        const forbidden = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" class="w-[18px] h-[18px] text-brand-orange dark:text-dark-brand-orange"><path fill-rule="evenodd" d="M7 8v2H6a3 3 0 00-3 3v6a3 3 0 003 3h12a3 3 0 003-3v-6a3 3 0 00-3-3h-1V8A5 5 0 007 8zm8 0v2H9V8a3 3 0 116 0zm-3 6a2 2 0 100 4 2 2 0 000-4z" clip-rule="evenodd"></path></svg>`
        for (let i = 0; i < trs.length; i++) {
            if (trs[i].innerHTML.indexOf(forbidden) !== -1) {
                trs[i].style.display = 'none';
            } else {
                trs[i].style.display = 'flex';
            }
        }
    }
    setTimeout(hideVipProblems, 1000)
}

document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        hideVipProblems();
        setTimeout(hideVipProblems, 1000)
        getSolveStatus();
    }
}
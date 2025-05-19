"use client"
import { Button, Card, CardBody, CardHeader, Progress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { useEffect, useState } from "react";
import { useCheckins, useUsers } from "./context/UserContext";

export default function Home() {

  // Fetch Data
  const users = useUsers();
  const checkins = useCheckins();

  const currentUser = users[0]; // Mockup

  // Is user already check in ?
  const [checked, setChecked] = useState(false);

  // Users Week Summary
  const [present, setPresent] = useState(0);
  const [ontimerate, setOntimerate] = useState(0);
  const [avrtime, setAvrtime] = useState('0');

  const [checkOntime, setCheckOntime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [totalcheckin, setTotalcheckin] = useState(0);
  const hour = String(((totalTime / totalcheckin) / 60).toFixed(0)).padStart(2, '0');
  const min = String(((totalTime / totalcheckin) % 60).toFixed(0)).padStart(2, '0');

  // Users Attendance Streak 
  const [curStreak, setCurStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastAbsent, setLastAbsent] = useState('0');

  // Today's Team Status
  const [ontime, setOntime] = useState(0);
  const [late, setLate] = useState(0);
  const [absent, setAbsent] = useState(0);

  useEffect(() => {
    let ontime = 0;
    let late = 0;
    let absent = 0;
    let streak = 0;
    let isStreakStop = false;

    [...checkins].reverse().map((data: any, index) => {

      // Summary Set data
      const checkin = new Date(data.time);
      const hours = checkin.getHours();
      const minutes = checkin.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      setTotalTime(prev => prev + totalMinutes);


      // Time Criteria 
      const onTimeStart = 7 * 60; // 07:00 AM
      const onTimeEnd = 9 * 60; // 09:00 AM
      const lateEnd = 12 * 60; // 12:00 AM
      const absentEnd = 7 * 60; // 07:00 AM

      if (totalMinutes >= onTimeStart && totalMinutes <= onTimeEnd) {
        data.status = 'On time';
        if (checkin.toDateString() === currentDate.toDateString()) ontime++;
      } else if (totalMinutes > onTimeEnd && totalMinutes <= lateEnd) {
        data.status = 'Late';
        if (checkin.toDateString() === currentDate.toDateString()) late++;
      } else if (totalMinutes <= absentEnd || totalMinutes > lateEnd) {
        data.status = 'Absent';
        if (checkin.toDateString() === currentDate.toDateString()) absent++;
      }


      // Check if it's user's Check in
      if (currentUser._id === data.user._id) {
        if (data.status === 'On time' || data.status === 'Late') {
          setPresent(prev => prev + 1);
          streak++;
        } else if (data.status === 'Absent') {
          if (!isStreakStop) {
            setCurStreak(streak);
          }
          if (streak > bestStreak) {
            setBestStreak(streak);
          }
          isStreakStop = true;
          setLastAbsent(new Date(data.time).toLocaleDateString('en-US', { weekday: "long", year: "numeric", month: "long", day: "numeric", }));
        }
        if (data.status === 'On time') setCheckOntime(prev => prev + 1);
        setTotalcheckin(prev => prev + 1);
        if (new Date(data.time).toDateString() === new Date().toDateString()) setChecked(true);
      }

    });

    setOntime(ontime);
    setLate(late);
    setAbsent(absent);

    if (!isStreakStop) {
      setCurStreak(streak);
      if (streak > bestStreak) {
        setBestStreak(streak);
      }
    }

  }, [users, checkins])

  useEffect(() => {
    setOntimerate(Number(((checkOntime / totalcheckin) * 100).toFixed(2)));
  }, [checkOntime, totalcheckin]);

  useEffect(() => {
    setAvrtime(`${hour}:${min} ${Number(hour) < 12 ? 'AM' : 'PM'}`);
  }, [hour, min]);

  // Current Date
  const currentDate = new Date();

  const dateFormatted = currentDate.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const mostStatus = Math.max(ontime, late, absent);

  const postData = async () => {
    try {
      const res = await fetch('http://localhost:8080/checkins', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: currentUser._id,
          time: new Date().toJSON()
        })
      });
      const data = await res.json();
      console.log('Post success : ', data);
      window.location.reload()

    } catch (error) {
      console.log('Error to post data : ', error);
    }
  };

  return (
    <section className="px-[40px] 2xl:px-[100px] py-[40px]">

      {/* Greeting and Check in */}
      <section id="greeting" className="flex flex-col 2xl:flex-row items-center justify-between mb-[60px]">
        <div>
          <p className="text-[#2D62FF] text-title">Welcome back, {currentUser.name}</p>
          <p className="text-[#3F3F3F] text-subtitle my-[15px] 2xl:my-[10px]">{dateFormatted}</p>
        </div>
        <Button disabled={checked} onPress={() => postData()} color="primary" className={`${checked ? 'bg-[#22C58C]' : 'bg-[#2D62FF]'} w-[200px] h-[80px] font-medium text-xl`}>{checked ? 'Checked In!' : 'Check In'}</Button>
      </section>

      {/* Statistics */}
      <section id="statistics" className="mb-[60px]">
        <p className="text-[#2D62FF] text-title mb-[20px] text-center 2xl:text-start">Statistics</p>
        <div className="flex flex-col 2xl:flex-row justify-between">
          <Card className="card">
            <CardHeader className="flex justify-between">
              <p className="text-[#282828] text-title">Your Summary</p>
            </CardHeader>
            <CardBody className="flex justify-between text-subtitle">
              <div className="flex justify-between">
                <p>Present ( On time & Late )</p>
                {/* / 2 for counter defect */}
                <p className="text-[#2D62FF]">{present / 2}</p>
              </div>
              <div className="flex justify-between">
                <p>On time rate</p>
                <p className="text-[#2D62FF]">{ontimerate}%</p>
              </div>
              <div className="flex justify-between">
                <p>Average check in time</p>
                <p className="text-[#2D62FF]">{avrtime}</p>
              </div>
            </CardBody>
          </Card>

          <Card className="card">
            <CardHeader className="flex justify-between">
              <p className="text-[#282828] text-title">Your Attendance Streak</p>
            </CardHeader>
            <CardBody className="flex justify-between text-subtitle h-[50px]">
              <div className="flex justify-between">
                <p>Current Streak</p>
                <p className="text-[#2D62FF]">{curStreak}</p>
              </div>
              <div className="flex justify-between">
                <p>Best Streak</p>
                <p className="text-[#2D62FF]">{bestStreak}</p>
              </div>
              <div className="flex justify-between">
                <p>Last Absent</p>
                <p className="text-[#2D62FF]">{lastAbsent}</p>
              </div>
            </CardBody>
          </Card>

          <Card className="card">
            <CardHeader className="flex justify-between">
              <p className="text-[#282828] text-title">Today’s Status</p>
              <p className="text-[#3F3F3F] text-subtitle">Totals {ontime + late + absent}</p>
            </CardHeader>
            <CardBody className="flex justify-between text-subtitle">
              <div className="flex justify-between items-center text-[#22C58C]">
                <p className="w-[80px]">On time</p>
                <Progress aria-label="On time" className="w-[180px] 2xl:w-[350px]" value={(ontime / mostStatus) * 100} classNames={{
                  indicator: "bg-[#22C58C]",
                  track: "bg-[#EEEEEE]",
                }} />
                <p>{ontime}</p>
              </div>
              <div className="flex justify-between items-center text-[#F97316]">
                <p className="w-[80px]">Late</p>
                <Progress aria-label="Late" className="w-[180px] 2xl:w-[350px]" value={(late / mostStatus) * 100} classNames={{
                  indicator: "bg-[#F98F16]",
                  track: "bg-[#EEEEEE]",
                }} />
                <p>{late}</p>
              </div>
              <div className="flex justify-between items-center text-[#EF445B]">
                <p className="w-[80px]">Absent</p>
                <Progress aria-label="Absent" className="w-[180px] 2xl:w-[350px]" value={(absent / mostStatus) * 100} classNames={{
                  indicator: "bg-[#EF445B]",
                  track: "bg-[#EEEEEE]",
                }} />
                <p>{absent}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Today's Check-Ins */}
      <section id="check-in" className="mb-[60px]">
        <p className="text-[#2D62FF] text-title mb-[20px] text-center 2xl:text-start">Total Check-Ins</p>
        <Table isStriped aria-label="Today's Check-Ins" classNames={{
          th: 'w-[100px] 2xl:w-[360px] bg-[#45474D] px-[30px] py-[20px]',
          td: 'px-[30px] py-[20px]'
        }}>
          <TableHeader>
            <TableColumn><p className="text-white text-subtitle">Name</p></TableColumn>
            <TableColumn><p className="text-white text-subtitle">Check-In Time</p></TableColumn>
            <TableColumn><p className="text-white text-subtitle">Status</p></TableColumn>
            <TableColumn><p className="text-white text-subtitle">Role</p></TableColumn>
          </TableHeader>
          <TableBody>
            {[...checkins].reverse().map((data: any, index) => (
              <TableRow key={index}>
                <TableCell><p className={`${data?.user?._id === currentUser._id ? 'text-[#2D62FF]' : 'text-[#282828]'} text-subtitle`}>{data?.user?.name}</p></TableCell>
                <TableCell><p className={`${data?.user?._id === currentUser._id ? 'text-[#2D62FF]' : 'text-[#282828]'} text-subtitle`}>{new Date(data?.time).toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</p></TableCell>
                <TableCell className="flex items-center ">
                  <div
                    className={`w-[15px] h-[15px] rounded-full mr-[10px] ${data?.status === "On time"
                        ? "bg-[#22C58C]"
                        : data.status === "Late"
                          ? "bg-[#F98F16]"
                          : data.status === "Absent"
                            ? "bg-[#EF445B]"
                            : "bg-[#282828]"
                      }`}
                  />
                  <p
                    className={`text-subtitle ${data.status === "On time"
                        ? "text-[#22C58C]"
                        : data.status === "Late"
                          ? "text-[#F98F16]"
                          : data.status === "Absent"
                            ? "text-[#EF445B]"
                            : "text-[#282828]"
                      }`}>{data?.status}</p>
                </TableCell>
                <TableCell><p className={`${data?.user?._id === currentUser._id ? 'text-[#2D62FF]' : 'text-[#282828]'} text-subtitle`}>{data?.user?.role?.en}</p></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </section>
  );
}

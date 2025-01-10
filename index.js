// First add the icons we need
const Calendar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
  
  const Search = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
  
  const Download = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );
  
  const ChevronLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
  
  const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
  
  function ChemotherapyDashboard() {
    const [patients, setPatients] = React.useState([]);
    const [formData, setFormData] = React.useState({
        patientName: '',
        hn: '',
        phoneNumber: '',
        diagnosis: '',
        appointmentDate: '',
        nextCycle: ''
    });

    React.useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/patients');
            const data = await response.json();
            if (data.success) {
                setPatients(data.data);
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
            alert('เกิดข้อผิดพลาดในการดึงข้อมูล');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/patients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patient_name: formData.patientName,
                    hn: formData.hn,
                    phone_number: formData.phoneNumber,
                    diagnosis: formData.diagnosis,
                    appointment_date: formData.appointmentDate,
                    next_cycle: formData.nextCycle
                }),
            });

            const data = await response.json();
            if (data.success) {
                alert('บันทึกข้อมูลสำเร็จ');
                setFormData({
                    patientName: '',
                    hn: '',
                    phoneNumber: '',
                    diagnosis: '',
                    appointmentDate: '',
                    nextCycle: ''
                });
                fetchPatients();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error adding patient:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(patients.map(p => ({
            'ชื่อผู้ป่วย': p.patient_name,
            'HN': p.hn,
            'เบอร์โทรศัพท์': p.phone_number,
            'การวินิจฉัย': p.diagnosis,
            'วันที่นัดหมาย': p.appointment_date,
            'รอบการรักษา': p.next_cycle
        })));
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Patients");
        XLSX.writeFile(wb, `chemotherapy_appointments_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const todayAppointments = patients.filter(p => 
        p.appointment_date === new Date().toISOString().split('T')[0]
    ).length;

    const thisMonthAppointments = patients.filter(p => 
        p.appointment_date.startsWith(new Date().toISOString().slice(0, 7))
    ).length;

    return (
        <div>
            <div className="header">
                <h1>ระบบนัดหมายเคมีบำบัด</h1>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>การนัดหมายวันนี้</h3>
                    <div className="number">{todayAppointments}</div>
                </div>
                <div className="stat-card">
                    <h3>จำนวนผู้ป่วยทั้งหมด</h3>
                    <div className="number">{patients.length}</div>
                </div>
                <div className="stat-card">
                    <h3>การนัดหมายเดือนนี้</h3>
                    <div className="number">{thisMonthAppointments}</div>
                </div>
            </div>

            <div className="card">
                <h2>เพิ่มผู้ป่วยใหม่</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="ชื่อผู้ป่วย"
                            value={formData.patientName}
                            onChange={e => setFormData({...formData, patientName: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="HN"
                            value={formData.hn}
                            onChange={e => setFormData({...formData, hn: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="tel"
                            className="form-control"
                            placeholder="เบอร์โทรศัพท์"
                            value={formData.phoneNumber}
                            onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="การวินิจฉัย"
                            value={formData.diagnosis}
                            onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>วันที่นัดหมาย</label>
                        <input
                            type="date"
                            className="form-control"
                            value={formData.appointmentDate}
                            onChange={e => setFormData({...formData, appointmentDate: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="รอบการรักษา (เช่น รอบที่ 2)"
                            value={formData.nextCycle}
                            onChange={e => setFormData({...formData, nextCycle: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        เพิ่มการนัดหมาย
                    </button>
                </form>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2>รายการนัดหมาย</h2>
                    <button onClick={exportToExcel} className="btn btn-success">
                        ส่งออก Excel
                    </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>ชื่อผู้ป่วย</th>
                                <th>HN</th>
                                <th>เบอร์โทรศัพท์</th>
                                <th>การวินิจฉัย</th>
                                <th>วันที่นัดหมาย</th>
                                <th>รอบการรักษา</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>
                                        ไม่มีข้อมูลการนัดหมาย
                                    </td>
                                </tr>
                            ) : (
                                patients.map((patient, index) => (
                                    <tr key={index}>
                                        <td>{patient.patient_name}</td>
                                        <td>{patient.hn}</td>
                                        <td>{patient.phone_number}</td>
                                        <td>{patient.diagnosis}</td>
                                        <td>{patient.appointment_date}</td>
                                        <td>
                                            <span className="badge badge-primary">
                                                {patient.next_cycle}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(
    <ChemotherapyDashboard />,
    document.getElementById('root')
);
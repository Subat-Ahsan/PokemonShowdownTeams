import Swal from 'sweetalert2';

export const deleteTeam = async (id, API_BASE_URL, setRefresh, refresh , reroute = "", navigate) => {
    
    try {
    const token = localStorage.getItem('token')
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'This action will delete the team permanently.',
      showCancelButton: true,
      confirmButtonText: 'Okay',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      const response = await fetch(API_BASE_URL + '/data/deleteTeam/' + id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Team Deleted successfully!',
          confirmButtonText: 'Okay',
        }) .then(() => {
            if ( typeof setRefresh === 'function') { 
                setRefresh(!refresh); 
            }
            if (typeof navigate === 'function') { 
                navigate(reroute) 
            }
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: data.error || 'Error',
          confirmButtonText: 'Okay',
        });
      }
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Oops!',
      text: 'Error: ' + err.message,
      confirmButtonText: 'Okay',
    });
  }
};

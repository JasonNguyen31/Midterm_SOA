
import threading

class PaymentLockManager:
    "Quản lý khóa giao dịch để tránh 2 người trả tiền cùng 1 học sinh cùng lúc."
    def __init__(self):
        self._locks = {}
        self._global_lock = threading.Lock()

    def acquire(self, student_id: str):
        "Khóa giao dịch của 1 sinh viên cụ thể (theo mssv)."
        with self._global_lock:
            if student_id not in self._locks:
                self._locks[student_id] = threading.Lock()
            lock = self._locks[student_id]
        lock.acquire()

    def release(self, student_id: str):
        "Mở khóa sau khi thanh toán xong."
        with self._global_lock:
            lock = self._locks.get(student_id)
        if lock and lock.locked():
            lock.release()

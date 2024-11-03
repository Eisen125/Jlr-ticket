// /**
//  * @param {number} x       
//  * @return {boolean}
//  */
// var isPalindrome = function(x) {
//     var s = '' + x;
//     var l = 0;
//     var r = s.length - 1;
//     while (l < r) {
//       if (s[l] !== s[r]) return false;
//       l++;
//       r--;
//     }
//     return true;


//     /**
//  * Definition for singly-linked list.
//  * function ListNode(val) {
//  *     this.val = val;
//  *     this.next = null;
//  * }
//  */
// /**
//  * @param {ListNode} head
//  * @return {ListNode}
//  */
// var sortList = function(head) {
//     if (!head || !head.next) return head;
//     var slow = head;
//     var fast = head;
//     var prev = null;
//     while (fast && fast.next) {
//       prev = slow;
//       slow = slow.next;
//       fast = fast.next.next;
//     }
//     prev.next = null;
//     return merge(sortList(head), sortList(slow));
//   };
  
//   var merge = function (list1, list2) {
//     var p1 = list1;
//     var p2 = list2;
//     var newHead = new ListNode(0);
//     var now = newHead;
//     while (p1 || p2) {
//       if (!p1 || !p2) {
//         now.next = p1 || p2;
//         break;
//       } else if (p1.val < p2.val) {
//         now.next = p1;
//         p1 = p1.next;
//       } else {
//         now.next = p2;
//         p2 = p2.next;
//       }
//       now = now.next;
//       now.next = null;
//     }
//     return newHead.next;
//   };